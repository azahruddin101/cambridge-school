# Eastern Cambridge School

A redesign of [easterncambridgeschool.co.in](https://easterncambridgeschool.co.in/) built with Next.js 16 (App Router), Tailwind CSS v4, Lenis smooth scrolling and GSAP scroll animations. The managing committee, faculty, fee structure, student strength and gallery are stored in MongoDB and edited from an admin panel at `/admin`.

## Setup

Create `.env.local` in the project root:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/cambridge?retryWrites=true&w=majority
JWT_SECRET=<long random string, e.g. `openssl rand -base64 48`>
ADMIN_USERNAME=admin               # first admin account, created by `npm run seed`
ADMIN_PASSWORD=<10+ characters>
UPLOAD_DIR=uploads                 # where uploaded images are stored
```

```bash
npm install
npm run seed     # creates the admin account and imports the initial content (safe to re-run)
npm run dev      # http://localhost:3000 — admin panel at /admin
npm run build    # prerenders public pages from the database (needs MONGODB_URI at build time)
npm start
```

## Admin panel

Sign in at `/admin` with the account created by `npm run seed`, then change the password under **Account**.

| Section | What it controls |
| --- | --- |
| Managing Committee | Members on `/administration` — name, role, place, optional photo, order |
| Faculty | Staff on `/administration` — name, designation, qualification, optional photo, order. Also drives the teacher count on the home page |
| Fee Structure | Fee heads per class group and the payment schedule on `/admissions/fee-structure`. Totals are calculated |
| Student Strength | Class-wise sections, boys and girls on `/admissions/student-strength`. Also drives the student count on the home page |
| Gallery | Photos on `/gallery`; the first five also appear on the home page |

Changes appear on the website as soon as they're saved.

### How it works

- **Authentication** — the login form checks the password (bcrypt) and sets a signed JWT (HS256, 7 days) in an `httpOnly` cookie. `src/proxy.js` redirects requests without a valid token to the login page; every admin page and Server Action also calls `requireAdmin()`, which checks the account still exists and the token hasn't been revoked. Changing the password signs out all other sessions. Failed logins are limited to 5 per 15 minutes per IP and username.
- **Uploads** — images are validated, auto-rotated, stripped of metadata (e.g. phone GPS), resized and converted to WebP, then saved to `uploads/<section>/<random-id>.webp` and served by `src/app/uploads/[...path]/route.js`. The `uploads/` folder is gitignored: back it up along with the database.
- **Caching** — public pages are prerendered from MongoDB with `"use cache"` and tagged per section (`src/lib/server/data.js`). Admin actions call `updateTag()` after saving, so the next visit gets fresh data.
- **Hosting** — uploads are written to the server's disk, so run it on a server with a persistent filesystem (a VPS, or a container with a mounted volume). Serverless hosts such as Vercel discard written files.

## Structure

```
public/images/               Static WebP assets (brand, campus, life, facilities, people)
uploads/                     Uploaded images (runtime data, gitignored)
scripts/
  seed.mjs, seed-data.mjs    First admin account + initial content
  optimize-images.mjs        Converts original photo downloads → public/images (sharp)
  build-logo.mjs             Builds logo.webp, emblem.webp and the app icon from the master logo
src/
  proxy.js                   Redirects signed-out visitors away from /admin
  app/
    layout.js                Root: fonts, metadata
    (site)/                  Public website (header, footer, smooth scroll, preloader)
    admin/
      login/                 Sign-in page
      (panel)/               Dashboard, committee, faculty, fees, strength, gallery, account
      _actions/              Server Actions (auth, content)
    uploads/[...path]/       Serves uploaded images
  components/
    admin/                   Admin UI (PeopleManager, GalleryManager, FeesEditor, StrengthEditor…)
    layout/ motion/ providers/ sections/ ui/   Public site components
  data/                      Static site copy (contact details, navigation, page text)
  lib/
    session.js               JWT sign/verify (shared with proxy.js)
    server/                  db, models, auth, uploads, cached data getters, admin helpers
    gsap.js, intro.js        Animation setup
```

## Editing static content

Text that isn't in the admin panel lives in `src/data/site.js` (contact details, navigation) and `src/data/content.js` (page copy, messages, facilities). To add static photos, put the originals in a folder, add entries to the map in `scripts/optimize-images.mjs`, then run `node scripts/optimize-images.mjs <folder>`.

## Motion

- Lenis drives scrolling from GSAP's ticker so ScrollTrigger stays in sync.
- Elements with `data-reveal` start hidden only when JS is available (a `js` class is set before first paint), so the site still reads fine without JavaScript.
- `prefers-reduced-motion` disables smooth wheel scrolling, pinned/scrubbed sequences and the preloader animation.
