# Jatin Pal — Portfolio

Personal portfolio of Jatin Pal, a B.Tech Cyber Security student at AITR Indore.

**Live:** https://portfolio-jatinpal.vercel.app/

## Stack

Plain HTML, CSS and JavaScript. There's no framework and no build step. It's deployed on Vercel as a static site.

```
index.html          page markup
style.css           all styles (light/dark theme tokens at the top)
main.js             theme toggle, nav, hero animation, certificate viewer
theme-init.js       applies the saved theme before first paint
404.html / 404.js   custom not-found page
vercel.json         security headers + caching
.well-known/        security.txt
public/
  certificates/     certificate images (webp)
  projects/         project screenshots (webp)
  logo/  icons/     logos and skill icons (self-hosted)
  fonts/            Inter variable font (self-hosted)
  Jatin_Pal_Resume.pdf
```

## Security

The site ships with a strict Content-Security-Policy: no inline scripts, no third-party scripts, fonts or images. It also sends HSTS, `X-Frame-Options: DENY`, `nosniff`, a locked-down Permissions-Policy and a `security.txt`.

You can check the headers at https://securityheaders.com.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Updating content

- **New certificate:**
  1. Export it as `.webp`, about 1200px wide.
  2. Put it in `public/certificates/`, using a lowercase-hyphenated name.
  3. Copy an existing `.cert-card-new` block in `index.html`.
- **New project:** add a `.webp` screenshot (at least 800px wide) to `public/projects/`, then copy an `article.project-card`.
- **Resume:**
  1. Replace `public/Jatin_Pal_Resume.pdf`.
  2. Regenerate `public/resume-preview.webp`, with the phone number removed.
  3. Update the experience cards in `index.html` if they changed.
