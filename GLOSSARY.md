# ConVERTer

ConVERTer is a fork of VERT: a file converter that runs entirely on the user's device and keeps pulling fixes from VERT.

## Language

**ConVERTer**:
The product this repo ships, a rebranded fork of VERT. Spelled exactly `ConVERTer` wherever users see the name, in every locale.
_Avoid_: Converter, VERT, VERT.sh

**Upstream**:
The original VERT project (`VERT-sh/VERT`) that ConVERTer was forked from and still merges changes from.
_Avoid_: Original, parent, main repo

**Fork repo**:
ConVERTer's own source repository (`AngkasaKGU/ConVERTer`), the target of every "source code" and commit link.
_Avoid_: New repo, our repo

**Local conversion**:
Conversion that happens entirely in the user's browser, without the file leaving the device. ConVERTer offers only this.
_Avoid_: Client-side conversion, offline mode

**External request**:
Any network request the app makes to a host other than the deployment serving it. ConVERTer makes none by default; a deployment's operator may opt in.
_Avoid_: Remote call, third-party request, server-side operation

**Video conversion server**:
Upstream's remote daemon (vertd) that converts video uploaded to it. ConVERTer never uses it.
_Avoid_: Backend, vertd server, server conversion
