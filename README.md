# TWatched

A personal episode tracker — a static site you host yourself on GitHub Pages, installed on your iPhone and iPad as a home-screen app, kept in sync through a private GitHub repo (the same pattern as your credit card tracker).

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | The app shell |
| `app.js` | All app logic |
| `manifest.webmanifest` | Makes it installable |
| `sw.js` | Offline app-shell caching |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons |

Everything is static — no build step, no server. Push it to a repo, turn on Pages, done.

---

## 1. Deploy to GitHub Pages

1. Create a new **public** repo, e.g. `twatched` (Pages needs public on the free plan, or Enterprise/Pro for private Pages).
2. Add all the files in this folder to the repo root (or to a `/docs` folder, or a `gh-pages` branch — whichever you prefer).
3. Repo Settings → Pages → set the source to that branch/folder.
4. Your app will be live at `https://<your-username>.github.io/twatched/` after a minute or two.

## 2. Install it on your iPhone and iPad

1. Open that URL in Safari (must be Safari on iOS/iPadOS for this to work).
2. Tap the Share icon → **Add to Home Screen**.
3. Do this on both devices. Each install is its own local copy until you connect sync (next step).

> iOS quirk carried over from your credit-card app: the installed home-screen app and Safari itself keep **separate** local storage. Always open the actual home-screen icon, not a Safari tab, once it's installed.

## 3. Turn on sync between your devices

This app doesn't have its own server — instead, like your credit-card tracker, it syncs by reading and writing a small JSON file in a **private GitHub repo** using a personal access token stored on your device.

**One-time setup:**

1. Create a new **private** repo, e.g. `twatched-data`. Leave it empty — no need to add any files yourself.
2. Go to GitHub → Settings → Developer settings → **Personal access tokens → Fine-grained tokens** → Generate new token.
   - Resource owner: you
   - Repository access: **Only select repositories** → pick `twatched-data`
   - Permissions → **Contents: Read and write**
   - Set an expiration you're comfortable with (you'll need to regenerate and re-enter it on both devices when it expires)
3. Copy the token (starts with `github_pat_…`) — GitHub only shows it once.
4. In TWatched → Settings → **Sync across devices**, enter your GitHub username, `twatched-data` as the repo name, and paste the token. Tap **Connect**.
5. Repeat step 4 on your other device, using the same repo and either the same token or a second one scoped the same way.

From then on, the app syncs automatically: on open, every few minutes while it's open, and right after you add, edit, check off, or delete a show. There's also a manual **Sync now** button in Settings.

**Built-in safety net:** if a device has an empty show list (e.g. a fresh install) and the repo already has data, the app always pulls from the repo instead of overwriting it — the same empty-device guard your credit-card app uses, so a fresh install can never wipe your existing list.

## 4. Notifications — what to expect

Turn Notifications on in Settings, and TWatched will ask permission the first time. It checks for newly-aired episodes:
- every time you open the app,
- every ~10 minutes while it stays open in the foreground.

When it finds one, you'll see the in-app banner and (if permission was granted) a real system notification.

**What this can't do:** notify you while the app has been fully closed for a long stretch — that needs something to wake it up from outside, which a static site can't do on its own. If you want real background delivery later, the cleanest add-on given this same GitHub-based setup is:
1. Generate a VAPID key pair for Web Push.
2. Add a Push subscription step in `app.js` (the browser Push API) and store the subscription in the same private repo.
3. Add a small scheduled **GitHub Actions workflow** (cron, e.g. hourly) that reads your shows + the stored subscription and sends a push via a `web-push`-style call for anything newly aired.

That's a self-contained follow-up (still no separate server or paid service) — ask if you'd like it built.

## 5. Notes on limits

- Poster photos are resized client-side to ~480px and compressed before being stored, to keep the synced JSON file small and reliable. With many custom photos across many shows you could eventually approach GitHub's plain file-size comfort zone (~1MB); if that ever happens, the fix is switching the sync calls from the simple Contents API to the Git Data (blobs/trees) API, which removes that ceiling.
- The fine-grained token is stored in plain `localStorage` on each device, scoped to only the one `twatched-data` repo — same trust model as your existing token-based sync.
