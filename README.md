# The Human Footnote — Publishing Platform 2.0

A locally functional independent storytelling magazine with an editorial dashboard, article database, drafts/publishing, cover uploads, story search, category filters and public story pages.

## Requirements
- Windows with Node.js **24+** (uses Node's built-in `node:sqlite` module)
- npm, internet for initial installation

## First-time setup
1. Extract this ZIP and open the **inner `the-human-footnote` directory** containing `package.json`.
2. Copy `.env.example` to `.env.local`.
3. Edit `.env.local` with your own admin email, **strong unique password (at least 12 characters)**, and a **random secret (at least 32 characters)**. Example PowerShell secret generation: `[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`.
4. In PowerShell run:
   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```
5. Visit `http://localhost:3000` for the magazine and `http://localhost:3000/admin/login` for the studio.

## What works
- Persistent SQLite article storage in `data/magazine.sqlite` (auto-created on first visit)
- Private editorial login, 12-hour signed HTTP-only session
- Create, edit, delete, draft and publish stories
- Feature articles on homepage
- Upload JPG/PNG/WebP cover images up to 5 MB to `public/uploads`
- Category filters and headline/summary search
- Mobile-friendly magazine and article templates
- Six **clearly labeled editorial samples** imported only into an empty database

## Editing articles
Go to `/admin`, choose **Write a story**, enter headline, summary, body (separate paragraphs with blank lines), byline, category, and image URL. Set status to Draft or Published. Click Save. Edit from the dashboard. Uploaded images provide a path you can paste into the cover field.

## Important limitations before public deployment
This is a **working local publishing platform / MVP**, not a production-hardened multiuser SaaS. The dashboard is single-admin. There is no live newsletter integration, rich-text editor, scheduled publishing, image captions/credits field, author permissions, revisions, editorial approval workflow, automated backups, rate-limited login, or email verification. These are future upgrades.

**Do not deploy this exact local SQLite version to serverless Vercel**: serverless filesystems are ephemeral. For public hosting, migrate the database to a persistent managed database and upload images to object storage; add rate limiting, monitoring, backup/restore, and appropriate editorial/privacy policies. Run security testing before launch.

The example photographs are third-party illustrative images, not evidence of the sample narratives. Replace them with licensed, consent-cleared images and accurate captions. No RAPID+ field interview or organizational material is included. Obtain permission for work-derived material before publishing independently.

## Project structure
- `app/page.tsx`: homepage
- `components/Magazine.tsx`: interactive magazine homepage
- `app/stories/[slug]/page.tsx`: article template
- `app/admin/`: editorial dashboard, sign in, editor, uploads
- `app/actions.ts`: server-side publishing operations
- `lib/db.ts`: SQLite schema, queries, sample import
- `lib/auth.ts`: signed session and admin credentials
- `lib/stories.ts`: demonstration content only
- `app/globals.css`: visual system

## Troubleshooting
If npm fails with `ECONNRESET`, check connectivity, run `npm.cmd ping`, and retry `npm.cmd install --no-audit --no-fund`. If the browser shows errors, check the terminal output. Avoid sharing `.env.local` or the SQLite database publicly.
