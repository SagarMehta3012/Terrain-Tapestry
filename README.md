# Terrain Tapestry — Website

A full site for the *Terrain Tapestry* landscape-architecture journal (by Resham Mehta), built to replace the
WordPress home page with a fast, self-hosted site: static frontend + a small Node/Express backend that powers a
working contact form.

```
terrain-tapestry/
├── public/           ← frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server/
│   └── index.js       ← Express server: serves the site + POST /api/contact
├── package.json
├── .env.example
└── README.md
```

## Run it locally

```bash
npm install
npm start
```

Visit **http://localhost:3000**. The contact form works immediately — without any setup, submitted messages are
saved to `server/messages.log.json` so nothing is lost.

## Turn on real email delivery (optional but recommended)

1. Copy `.env.example` to `.env`.
2. Fill in `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for Gmail, create an **App Password** at
   myaccount.google.com/apppasswords — a normal password won't work).
3. Set `CONTACT_TO` to the inbox that should receive messages.
4. Restart the server. New submissions will now be emailed instead of logged locally.

## Deploy it — free options

### Option A: Render.com (recommended, easiest)
1. Push this folder to a GitHub repo.
2. On [render.com](https://render.com) → **New → Web Service** → connect the repo.
3. Build command: `npm install`  ·  Start command: `npm start`
4. Add the environment variables from `.env.example` under **Environment**.
5. Deploy — Render gives you a live URL (you can attach a custom domain like `terraintapestry.com` for free on
   Render's dashboard under **Settings → Custom Domain**).

### Option B: Railway.app
1. Push to GitHub, then **New Project → Deploy from GitHub repo** on railway.app.
2. Railway auto-detects Node — no extra config needed.
3. Add the same environment variables, deploy, attach a custom domain.

### Option C: Any VPS (DigitalOcean, EC2, etc.)
```bash
git clone <your-repo>
cd terrain-tapestry
npm install
npm install -g pm2
pm2 start server/index.js --name terrain-tapestry
pm2 save
```
Put Nginx or Caddy in front for HTTPS and your domain.

## Buying / pointing a domain

Once deployed, buy a domain (e.g. via Namecheap, GoDaddy, or Google Domains) such as `terraintapestry.com` or
`mehtareshamc.com`, then add a CNAME/A record pointing to whichever host you chose above. Render and Railway both
walk you through this under their "Custom Domain" settings and issue free HTTPS certificates automatically.

## Editing content

- All page copy lives in `public/index.html` — category descriptions, blog post cards, and the About section.
- Colours, type and spacing are all defined as CSS variables at the top of `public/styles.css` under `:root`.
- To add a new blog post card, duplicate one `<article class="post-card">` block in the "Journal" section.
- To add a new category "plate", duplicate one `<article class="plate">` block and update the image, title,
  description and link.

## Notes

- The "Categories" and "Journal" links currently point to the existing WordPress/`mehtareshamc.in` pages for the
  full long-form articles, since that content lives across many individual posts. If you'd like those migrated
  into this site as native pages too, that's a natural next step — just say the word.
- Images are currently hot-linked from the existing WordPress media library so the site works immediately. For a
  fully independent deployment, download them into `public/assets/` and update the `src` paths in `index.html`.
