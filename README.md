# anniesailing.ca

One-page landing site for **Annie Balasubramanian** — Canadian national team sailor, ILCA 6.
Static HTML/CSS/JS. No build step. Hosted on GitHub Pages with the custom domain `anniesailing.ca`.

```
index.html            the page
404.html              off-brand-safe not-found page
CNAME                 custom domain for GitHub Pages (anniesailing.ca)
.nojekyll             serve files as-is (don't run Jekyll)
robots.txt sitemap.xml
assets/
  css/style.css
  js/main.js
  img/                optimized photos (resized/compressed from originals)
```

---

## 1. Before it goes live — two things to fill in

### a) Contact form access key  *(required for the form to send)*
The contact form uses [Web3Forms](https://web3forms.com) (no account needed — just an email).

1. Go to <https://web3forms.com>, enter the email address where Annie wants inquiries to land, and copy the **Access Key** it emails you.
2. In `index.html`, find:
   ```html
   <input type="hidden" name="access_key" value="REPLACE_WITH_WEB3FORMS_ACCESS_KEY">
   ```
   Replace the value with the key. That's it — `assets/js/main.js` auto-detects the key and switches the form to AJAX submit with an inline success message.

Until the key is set, the form still renders but submitting does nothing useful. The "DM on Instagram" fallback link always works.

### b) Photo credits
Sailing photos usually need a photographer credit. Add them in the footer of `index.html`:
```html
<p class="footer__fine">
  Photos © their respective photographers.   <!-- e.g. "Photos: Jane Doe / Sail Canada" -->
```
Current images were resized from the originals in the parent folder; replacements just need to drop into `assets/img/` with the same filenames (or update the `src`/`srcset`).

---

## 2. DNS setup (custom domain)

At your registrar for **anniesailing.ca**, create these records:

| Type  | Host / Name | Value |
|-------|-------------|-------|
| A     | `@`         | `185.199.108.153` |
| A     | `@`         | `185.199.109.153` |
| A     | `@`         | `185.199.110.153` |
| A     | `@`         | `185.199.111.153` |
| AAAA  | `@`         | `2606:50c0:8000::153` |
| AAAA  | `@`         | `2606:50c0:8001::153` |
| AAAA  | `@`         | `2606:50c0:8002::153` |
| AAAA  | `@`         | `2606:50c0:8003::153` |
| CNAME | `www`       | `chrystalight.github.io.` |

Then in the repo: **Settings → Pages → Custom domain** = `anniesailing.ca`, and tick **Enforce HTTPS** once the cert is issued (can take a few minutes to an hour after DNS resolves).

> The `CNAME` file in this repo already pins the domain, so Pages picks it up on deploy.

---

## 3. Deploy

GitHub Pages serves the `main` branch root. Any push to `main` publishes.

```bash
git add -A
git commit -m "Update site"
git push
```

If Pages isn't enabled yet: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `root`**.

---

## 4. Local preview

No tooling required — open `index.html` in a browser, or:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 5. Editing content

Everything is in `index.html`, section by section (About, 2026 Season, Results, Support, Work with Annie, Contact). Results tables are plain `<table>`s grouped by year; the "Show earlier seasons" button reveals the `data-earlier` groups. Links to Instagram and WindAthletes appear in the hero, the Support panel, and the footer — update all three if a URL changes.
