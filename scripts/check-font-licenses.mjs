// Fails when a font file in the build has no SIL OFL license text served next to it.
// The OFL (§2) requires every copy of the font to come with its copyright notice and the license.
// For each .woff/.woff2/.ttf/.otf in the build dir, the font's copyright notice (name table ID 0)
// must appear verbatim in one of the license files in <build>/licenses/fonts/ (from static/licenses/fonts/).
// A font with no ID 0 also fails, since it can't be matched to a license.
// The OFL also forbids changing its own text, so each license file must match the SHA-256 listed
// for it in SOURCES.md (a table row naming the file and its hash), and every listed file must exist.
// Usage: node scripts/check-font-licenses.mjs [build dir]
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { brotliDecompressSync, inflateSync } from "node:zlib";

const BUILD = process.argv[2] ?? "build";
const LICENSE_DIR = join(BUILD, "licenses", "fonts");
const FONT_EXT = /\.(woff2?|ttf|otf)$/i;

// WOFF2 known-table tags, indexed by the 6-bit flag (WOFF2 spec, table 5.1)
// prettier-ignore
const WOFF2_TAGS = ["cmap","head","hhea","hmtx","maxp","name","OS/2","post","cvt ","fpgm","glyf","loca","prep","CFF ","VORG","EBDT","EBLC","gasp","hdmx","kern","LTSH","PCLT","VDMX","vhea","vmtx","BASE","GDEF","GPOS","GSUB","EBSC","JSTF","MATH","CBDT","CBLC","COLR","CPAL","SVG ","sbix","acnt","avar","bdat","bloc","bsln","cvar","fdsc","feat","fmtx","fvar","gvar","hsty","just","lcar","mort","morx","opbd","prop","trak","Zapf","Silf","Glat","Gloc","Feat","Sill"];

// returns the raw bytes of the font's "name" table
function nameTable(buf) {
	const sig = buf.toString("latin1", 0, 4);
	if (sig === "wOFF") {
		const numTables = buf.readUInt16BE(12);
		for (let i = 0; i < numTables; i++) {
			const entry = 44 + i * 20;
			if (buf.toString("latin1", entry, entry + 4) !== "name") continue;
			const offset = buf.readUInt32BE(entry + 4);
			const compLength = buf.readUInt32BE(entry + 8);
			const origLength = buf.readUInt32BE(entry + 12);
			const data = buf.subarray(offset, offset + compLength);
			return compLength === origLength ? data : inflateSync(data);
		}
	} else if (sig === "wOF2") {
		const numTables = buf.readUInt16BE(12);
		const compressedSize = buf.readUInt32BE(20);
		let pos = 48;
		const base128 = () => {
			let value = 0;
			for (let i = 0; i < 5; i++) {
				const byte = buf[pos++];
				value = (value << 7) | (byte & 0x7f);
				if (!(byte & 0x80)) return value >>> 0;
			}
			throw new Error("bad UIntBase128");
		};
		let offset = 0;
		let name;
		for (let i = 0; i < numTables; i++) {
			const flags = buf[pos++];
			let tag;
			if ((flags & 0x3f) === 0x3f) {
				tag = buf.toString("latin1", pos, pos + 4);
				pos += 4;
			} else tag = WOFF2_TAGS[flags & 0x3f];
			const version = flags >> 6;
			const origLength = base128();
			// glyf/loca are transformed at version 0; other tables at any non-zero version
			const transformed =
				tag === "glyf" || tag === "loca"
					? version === 0
					: version !== 0;
			const length = transformed ? base128() : origLength;
			if (tag === "name") name = { offset, length };
			offset += length;
		}
		if (!name) return null;
		const tables = brotliDecompressSync(
			buf.subarray(pos, pos + compressedSize),
		);
		return tables.subarray(name.offset, name.offset + name.length);
	} else if (sig === "\0\x01\0\0" || sig === "OTTO" || sig === "true") {
		const numTables = buf.readUInt16BE(4);
		for (let i = 0; i < numTables; i++) {
			const entry = 12 + i * 16;
			if (buf.toString("latin1", entry, entry + 4) !== "name") continue;
			const offset = buf.readUInt32BE(entry + 8);
			return buf.subarray(offset, offset + buf.readUInt32BE(entry + 12));
		}
	} else {
		throw new Error(
			`unknown font format (signature ${JSON.stringify(sig)})`,
		);
	}
	return null;
}

// returns every name ID 0 string in the font (all platforms/languages)
function copyrightNotices(file) {
	const table = nameTable(readFileSync(file));
	if (!table) return [];
	const count = table.readUInt16BE(2);
	const stringOffset = table.readUInt16BE(4);
	const notices = new Set();
	for (let i = 0; i < count; i++) {
		const record = 6 + i * 12;
		const platform = table.readUInt16BE(record);
		const encoding = table.readUInt16BE(record + 2);
		if (table.readUInt16BE(record + 6) !== 0) continue;
		const length = table.readUInt16BE(record + 8);
		const offset = table.readUInt16BE(record + 10);
		const raw = Buffer.from(
			table.subarray(
				stringOffset + offset,
				stringOffset + offset + length,
			),
		);
		let text;
		if (platform === 0 || platform === 3)
			text = raw.swap16().toString("utf16le");
		else if (platform === 1 && encoding === 0)
			text = raw.toString("latin1");
		else continue;
		if (text.trim()) notices.add(text.trim());
	}
	return [...notices];
}

function* walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* walk(path);
		else yield path;
	}
}

const problems = [];

const licenses = existsSync(LICENSE_DIR)
	? readdirSync(LICENSE_DIR)
			.filter((f) => f.endsWith(".txt"))
			.map((f) => ({
				name: f,
				bytes: readFileSync(join(LICENSE_DIR, f)),
			}))
			.map((l) => ({ ...l, text: l.bytes.toString("utf8") }))
	: [];
if (licenses.length === 0)
	problems.push(`no license .txt files found in ${LICENSE_DIR}/`);

// license files must stay byte-for-byte what their upstream ships (hashes recorded in SOURCES.md)
const sourcesPath = join(LICENSE_DIR, "SOURCES.md");
const expected = new Map(); // file -> sha256
if (existsSync(sourcesPath)) {
	for (const line of readFileSync(sourcesPath, "utf8").split("\n")) {
		const file = line.match(/\[([^\]]+\.txt)\]/)?.[1];
		const hash = line.match(/`([0-9a-f]{64})`/)?.[1];
		if (file && hash) expected.set(file, hash);
	}
} else problems.push(`${sourcesPath} is missing`);
for (const { name, bytes } of licenses) {
	const actual = createHash("sha256").update(bytes).digest("hex");
	if (!expected.has(name))
		problems.push(`${name}: no SHA-256 listed in SOURCES.md`);
	else if (expected.get(name) !== actual)
		problems.push(
			`${name}: SHA-256 ${actual} doesn't match SOURCES.md (the license text was modified)`,
		);
}
for (const name of expected.keys())
	if (!licenses.some((l) => l.name === name))
		problems.push(`${name}: listed in SOURCES.md but missing`);

let fonts = 0;
const used = new Map(); // license file -> fonts it covers
for (const file of walk(BUILD)) {
	if (!FONT_EXT.test(file)) continue;
	fonts++;
	const rel = relative(BUILD, file);
	let notices;
	try {
		notices = copyrightNotices(file);
	} catch (e) {
		problems.push(`${rel}: can't read name table (${e.message})`);
		continue;
	}
	if (notices.length === 0) {
		problems.push(`${rel}: no copyright notice (name ID 0)`);
		continue;
	}
	for (const notice of notices) {
		const license = licenses.find((l) => l.text.includes(notice));
		if (!license) {
			problems.push(`${rel}: no license file contains "${notice}"`);
			continue;
		}
		used.set(license.name, (used.get(license.name) ?? 0) + 1);
	}
}

// an empty or misplaced build dir must not pass silently
if (fonts === 0) problems.push(`no font files found in ${BUILD}/`);

if (problems.length > 0) {
	console.error(
		`Font license problems in ${BUILD}/ (see static/licenses/fonts/SOURCES.md):`,
	);
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}
const summary = [...used].map(([name, n]) => `${name}: ${n}`).join(", ");
console.log(
	`All ${fonts} fonts in ${BUILD}/ have unmodified license text (${summary})`,
);
