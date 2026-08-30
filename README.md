# cut house

Portfolio site for cut house. Next.js 16, Sanity for content, Mux for video,
deployed on Vercel. The editing Studio is built in at `/studio`, so there is one
repo, one deploy, one domain.

**The code is done — everything below is setup.**

| | |
| --- | --- |
| Repository | `tylenn/cut-house` |
| Sanity project | `mpliyuvs` |
| Dataset | `production` |
| Node | 24.x |

You already have GitHub, Vercel and this repository. The Sanity project exists
and you have been invited to it. The only account still to open is **Mux**, which
handles video encoding and streaming.

---

## A. Get into Sanity

Sanity is where all the writing, films and credits live. An invite has gone to
**info@tylen.ca** — accept it, then check you can open the project at
[sanity.io/manage](https://sanity.io/manage).

Nothing to add yet. Content comes last, once the site is deployed and Mux is
connected.

---

## B. Deploy to Vercel

About ten minutes. **The build fails if the settings are not in first**, so add
them before you press deploy.

### 1. Import the repository

vercel.com → Add New → Project → pick `cut-house`.

Leave the framework preset and build command exactly as detected — Vercel
recognises Next.js on its own. Do not deploy yet.

### 2. Set Node to 24.x

Settings → General → Node.js Version. Several dependencies will not install
cleanly on anything older.

### 3. Add the three settings

Settings → Environment Variables. Add each to all three environments —
Production, Preview and Development.

```
NEXT_PUBLIC_SANITY_PROJECT_ID     mpliyuvs
NEXT_PUBLIC_SANITY_DATASET        production
NEXT_PUBLIC_SANITY_API_VERSION    2026-01-01
```

> **Paste these without quotation marks.** Type `mpliyuvs`, not `"mpliyuvs"`.
> Vercel treats a value literally, so quotation marks become part of it and every
> page fails to find the project. This is the most common way the setup goes
> wrong.

None of these three are secret. They identify a public dataset and nothing more,
so there is no risk in them travelling over email or a message.

### 4. Deploy

Two or three minutes. You will get a `.vercel.app` address.

**Expect an empty grid.** Nothing has been published yet, so a working site with
no films in it is the correct result at this stage — not a failure.

---

## C. Point your domain at it

### 1. Add the domain in Vercel

Project → Settings → Domains. Enter the domain, then follow the DNS records
Vercel gives you at your registrar. Propagation is usually minutes, occasionally
a few hours.

### 2. Tell Sanity about the domain

sanity.io/manage → API → CORS Origins. Add the live domain with **credentials
allowed** ticked.

> **This one fails silently.** Skip it and the public site still works perfectly
> — only the editing interface breaks, with a generic network error that never
> mentions the real cause. If editing ever stops working after a domain change,
> check here first.

### 3. Set the site address — optional

Add `NEXT_PUBLIC_SITE_URL` as your domain with no trailing slash, e.g.
`https://cuthouse.ca`. It only affects link previews and the sitemap, and falls
back to the Vercel address on its own, so it can wait.

---

## D. Connect Mux

Mux does the encoding and streaming. One upload gives you the poster frame, the
looping grid preview, the aspect ratio and the duration automatically — there is
nothing to prepare beforehand.

### 1. Create the account and a token

mux.com → Settings → Access Tokens.

- Sign up and add a payment method. Mux bills by usage — encoding, storage and
  streaming.
- Create an access token with **Mux Video** read and write permissions.
- You will be shown a **token ID** and a **secret key**. The secret is displayed
  once and never again — save it to a password manager straight away.

### 2. Paste them into the Studio

Open `yourdomain.com/studio`, create or open any project, find the **Film** field
and click the settings icon on the Mux input. Paste the token ID and secret key.

Mux credentials are **not** environment variables and do not belong in Vercel.
They are stored inside the Sanity project, and you only do this once for
everything.

---

## E. Add the work

Everything from here happens at `yourdomain.com/studio`. Only a title and a URL
are ever required — a project can go up today with just a film and a name, and be
filled in months later.

### Site settings and the information page

Both are pinned in the Studio sidebar. Site settings holds the name, tagline,
email and social links. The information page holds your write-up and the client
list.

Your bio, ready to paste into the information page's **About** field. Edit it
freely — it is not fixed anywhere in the code:

> With the ability to execute distinctive projects, Tylen's work has led him to
> collaborate with global brands such as Sony, Salomon, Turo and more. Having
> majored in design, his creative practice is deeply informed by the arts,
> bringing a unique approach to every project.

### Each project

| Field | What it does |
| --- | --- |
| **Title** | Required. Shown on the grid and the project page. |
| **URL** | Required. Press Generate — it fills from the title. |
| **Film** | The main video. Upload once; Mux does the rest. |
| **My role** | Your role — Director, Editor, DP. Shows in grey under the grid title, and at the top of the credits. |
| **Collaborators** | Everyone else. Role, name, and an optional link to their site. |
| **More films** | Cutdowns, alternates, behind the scenes. Run under the credits, two across on desktop. |
| **Client** | Leave blank for personal work. |
| **Date** | Drives the displayed year and the grid order. |
| **Still frame** | Optional. Overrides the frame Mux picks. |
| **Hover preview** | Optional. Overrides the looping preview on the grid. |
| **Stills** | A gallery, each with alt text and a caption. |
| **Write-up** | Long-form text for the project page. |
| **Position** | Optional. Manual grid order; blank falls back to newest first. |
| **Hide from the grid** | Drops it from the index while its link keeps working. |

Nothing is public until you press **Publish**. Published changes appear on the
site within a few minutes.

---

## Every setting, in one place

| Name | Value | Needed? | Secret? |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `mpliyuvs` | Required | No |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Required | No |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-01-01` | Required | No |
| `NEXT_PUBLIC_SITE_URL` | Your domain, no trailing slash. Falls back on its own. | Optional | No |
| `SANITY_API_READ_TOKEN` | Only to preview unpublished drafts on the live site. | Optional | **Yes** |
| `SANITY_REVALIDATE_SECRET` | Only to make a publish appear instantly rather than shortly after. | Optional | **Yes** |
| `SANITY_API_WRITE_TOKEN` | Developer machines only. It can delete all of your content. | **Never add** | **Yes** |

> **The one hard rule.** Never put `SANITY_API_WRITE_TOKEN` into Vercel. It has
> full edit and delete rights over your content, and the live site has no use
> for it.

---

## Confirm it worked

- [ ] The Vercel build finishes green.
- [ ] Your domain loads the site over https.
- [ ] `/studio` opens and lists the document types without a network error.
- [ ] A video uploads to the Film field and shows a thumbnail once processing finishes.
- [ ] Publishing a project makes it appear on the homepage.

---

## If it breaks

| What you see | What's wrong |
| --- | --- |
| Build fails: `Dataset not found` | The project ID is missing, mistyped, or was pasted with quotation marks around it. |
| Build fails: `Missing environment variable…` | One of the three required settings is absent, or was not applied to the Production environment. |
| Site works, but `/studio` shows a network error | The domain is missing from CORS Origins, or was added without credentials allowed. |
| Every page fails after it had been working | The dataset was switched to private. Set it back to public. |
| No Mux settings icon, or uploads fail | The Mux token lacks Mux Video write permission, or was never entered in the Studio. |
| A published change has not appeared | Normal. Give it a few minutes. |
| Homepage says nothing is published | Correct when the dataset is empty, or when everything in it is still a draft. |

---

## Working on the code

Requires **Node 24 LTS**. There is an `.nvmrc`.

```bash
nvm use
npm install
cp .env.example .env.local   # then fill in the project ID
npm run typegen
npm run dev
```

| Command | Does |
| --- | --- |
| `npm run dev` | Site at `/`, Studio at `/studio` |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run typegen` | Regenerate `src/sanity/types.ts` from schema + queries |

Run `npm run typegen` after **any** schema or query change — `src/sanity/types.ts`
is generated, committed, and the build depends on it.

Colour, type and motion tokens all live in a single `@theme` block in
`src/app/globals.css`, so design changes do not need a refactor.
