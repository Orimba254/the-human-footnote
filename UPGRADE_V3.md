# The Human Footnote — V3 upgrade notes

This release preserves the V2 Next.js/SQLite application and adds a new blue/lime/white palette based on the supplied reference, a safe Markdown-style writing toolbar with preview, inline article images, and automatic revision snapshots when existing articles are saved. The public layout is preserved.

## Upgrade without losing articles
1. Stop the V2 server. Back up the entire V2 directory, especially `data/magazine.sqlite`, `public/uploads/`, and `.env.local`.
2. Extract V3 into a **new** folder. Do not overwrite your working V2 project.
3. Copy `data/magazine.sqlite` and `public/uploads/` from V2 into the matching V3 paths. Copy your V2 `.env.local` privately to the V3 root; rotate the session secret if it was disclosed.
4. From the new project folder run `npm.cmd install`, `npm.cmd run dev -- -p 3100`. Visit `http://localhost:3100/admin/login`.
5. Test draft/edit/preview/publish and image rendering before retiring V2.

## Editorial formatting
The editor supports `## Heading`, `### Subheading`, `**bold**`, `*italic*`, `> Quote`, `- List`, `[link](https://example.com)`, and `![caption](/uploads/file.jpg)`. Leave blank lines between blocks. The editor preview is client-side and does not autosave. Revision snapshots are saved when editing an existing story; restoring revisions is not yet implemented.

## Not yet production ready
SQLite and uploads remain local. There is no cloud backup, multi-user permissions, scheduled publishing, newsletter delivery, or hosted deployment. Run `npm.cmd audit` and address vulnerabilities before deployment. This is a functional incremental V3, not a complete production newsroom.
