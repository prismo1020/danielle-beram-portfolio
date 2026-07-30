# Danielle Beram: Learning & Development Portfolio

A static portfolio site covering global onboarding, new-store training, eLearning production, an internal AI knowledge assistant, and career history. The site is built for GitHub Pages with no build step or dependencies.

## Files

- `index.html`: portfolio overview, selected work, metrics, and recruiter shortcut
- `about.html`: career progression, leadership scope, regions supported, and personal interests
- `onboarding.html`: chronological case study of the first 90 days
- `nso.html`: product case study for the New Store Opening Portal
- `apollo.html`: knowledge-source, correction, and maintenance case study for the internal AI assistant
- `elearning.html`: eLearning production workflow and 54-module catalog
- `training.html`: 14-day to 5-day new-store training redesign
- `contact.html`: résumé, professional scope, relocation, and contact information
- `css/style.css`: all styling (edit colors and type here)
- `assets/headshot.png`: portrait
- `assets/og-human.png`: social sharing preview
- `BRAND-KIT.md`: editorial standards, voice, typography, color, and layout guidance
- `TOMORROW-CHECKLIST.md`: manual evidence and assets still needed
- `robots.txt`, `sitemap.xml`, `404.html`: search and site-quality support

## Preview locally

Open `index.html` in any browser. Everything is linked with relative paths, so it works straight from the folder.

## Publish on GitHub Pages (free)

1. Create a new GitHub repository. For a personal site at `yourname.github.io`, name the repo exactly `yourusername.github.io`. For a project-style URL, any name works.
2. Upload the full contents of this folder to the repo (keep the folder structure: `index.html` at the top level, with `css/` and `assets/` beside it).
3. In the repo, go to Settings, then Pages.
4. Under "Build and deployment", set Source to "Deploy from a branch", pick the `main` branch and the `/ (root)` folder, and save.
5. Wait a minute or two. Your site will be live at the URL GitHub shows on that Pages screen.

To use a custom domain later, add it under Settings, then Pages, then "Custom domain".

## Editing

- Colors and fonts live at the top of `css/style.css` in the `:root` block. Change a value once and it updates everywhere.
- Read `BRAND-KIT.md` before changing the visual system or writing new copy.
- Text content is in the `.html` files. Case study copy is plain and easy to edit.
- To add another case study, copy the page whose evidence type is most similar, then change the structure so the narrative fits the new work rather than repeating the same headings.
