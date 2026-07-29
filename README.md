# Event Gallery

A simple photo gallery, grouped by event, that you host on Vercel via GitHub.
Add photos → push → the site updates itself automatically. No app to open,
no manual re-uploading — just a link that always shows the latest photos.

## 1. Put this on GitHub

1. Create a new repository on github.com (e.g. `event-gallery`). Leave it empty
   (no README/license) since you already have files.
2. From this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial gallery"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/event-gallery.git
   git push -u origin main
   ```

## 2. Connect it to Vercel

1. Go to vercel.com → **Add New Project** → import the GitHub repo you just created.
2. Vercel will detect `vercel.json` automatically — no settings to change.
3. Click **Deploy**. You'll get a live link like `https://event-gallery-yourname.vercel.app`.
4. Share that link with anyone — the gallery opens directly in the browser.

## 3. Adding new event photos (do this anytime)

1. Inside `photos/`, make a new folder named:
   ```
   YYYY-MM-DD-Event-Name
   ```
   Example: `photos/2026-08-02-Team-Offsite/`
2. Drop your photos into that folder (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`).
3. Commit and push:
   ```
   git add .
   git commit -m "Add Team Offsite photos"
   git push
   ```
4. Vercel automatically rebuilds and the new event appears on the live link
   within a minute — no need to touch any code.

That's the whole workflow going forward: new folder, new photos, `git push`.

## Doing it without the command line

If you'd rather not use git commands, you can also:
- Upload files directly on github.com (drag photos into the `photos/` folder
  in the web UI, in a new subfolder, then commit).
- Or connect this repo to GitHub Desktop and drag folders in from Finder/Explorer.

Either way, every push triggers a new Vercel deployment automatically.

## Removing the sample event

This project ships with one sample folder, `photos/2026-07-15-Sample-Event/`,
so you can see the gallery working right away. Delete that folder whenever
you're ready to add your real events.

## Local preview (optional)

```
node generate-manifest.js
python3 -m http.server 8000
```
Then open http://localhost:8000
