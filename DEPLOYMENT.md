# VHS Horror Puzzle Collection - GitHub Pages Deployment

## 🚀 Quick Start

The VHS Horror Puzzle Collection is now live on GitHub Pages!

**Live Site:** https://snakeslater.github.io/vhs-puzzles/

## 📋 Deployment Process

### Initial Setup (Already Done)
1. ✅ Created `gh-pages` branch from `testing-superpowers`
2. ✅ Added GitHub remote: `https://github.com/SnakesLater/vhs-puzzles.git`
3. ✅ Created GitHub Pages workflow in `.github/workflows/pages.yml`
4. ✅ Updated README.md with correct links
5. ✅ Pushed to GitHub and triggered deployment

### How It Works
- **Branch**: `gh-pages` branch serves as the live site
- **Workflow**: GitHub Actions automatically deploys on push to `gh-pages`
- **URL**: `https://snakeslater.github.io/vhs-puzzles/`
- **Build**: No build process needed - serves static HTML/CSS/JS

## 🔄 Updating the Site

### Method 1: Direct to gh-pages (Quick Updates)
```bash
cd vhs-puzzles
git checkout gh-pages
# Make your changes
git add .
git commit -m "Update site content"
git push github gh-pages
```

### Method 2: From Development Branch (Recommended)
```bash
cd vhs-puzzles
# Make changes in testing-superpowers or main
git checkout testing-superpowers
# ... make changes ...
git add .
git commit -m "New feature"
git push origin testing-superpowers

# Deploy to gh-pages
git checkout gh-pages
git merge testing-superpowers  # or main
git push github gh-pages
```

### Method 3: Using Pull Requests (Team Collaboration)
1. Create feature branch from `testing-superpowers`
2. Make changes and push to GitHub
3. Create Pull Request to `testing-superpowers`
4. Create Pull Request from `testing-superpowers` to `gh-pages`
5. Merge to deploy

## 📁 File Structure

```
vhs-puzzles/
├── index.html          # Main game page
├── README.md           # Updated with correct links
├── package.json        # Development server config
├── css/                # All stylesheets
├── js/                 # All JavaScript files
├── assets/             # Images, videos, audio
├── data/               # Puzzle data
└── .github/workflows/
    └── pages.yml       # GitHub Pages deployment workflow
```

## ⚙️ GitHub Pages Configuration

### Settings (Already Configured)
- **Source**: Deploy from `gh-pages` branch
- **Custom Domain**: None (using GitHub subdomain)
- **HTTPS**: Enabled automatically

### Workflow Details
- **Trigger**: Push to `gh-pages` branch
- **Build**: No build step (static site)
- **Deploy**: GitHub Pages hosting
- **Cache**: Pages cache for performance

## 🧪 Testing Locally

Before deploying, test locally:

```bash
cd vhs-puzzles
npm start
# Open http://localhost:8000 in your browser
```

## 🐛 Troubleshooting

### Site Not Updating
1. Check GitHub Actions workflow ran successfully
2. Verify `gh-pages` branch has latest changes
3. Clear browser cache (Ctrl+F5)

### Broken Links
- Ensure all relative paths work from root directory
- Test locally with `npm start`

### GitHub Actions Failures
- Check workflow logs in GitHub repository
- Verify file permissions
- Check for syntax errors in YAML

## 📈 Performance Notes

- **Static Assets**: All assets are optimized for web delivery
- **No Build Step**: Direct file serving for fastest deployment
- **Caching**: GitHub Pages provides automatic caching
- **CDN**: GitHub's global CDN for fast loading

## 🔒 Security

- **HTTPS**: Automatically enforced by GitHub Pages
- **No Secrets**: No sensitive data in repository
- **Static Only**: No server-side code execution

## 📞 Support

For deployment issues:
1. Check GitHub repository Actions tab
2. Verify local testing works with `npm start`
3. Review this documentation
4. Create issue in GitHub repository

---

**Last Updated:** January 18, 2026
**Deployment Method:** GitHub Pages with GitHub Actions
**Status:** ✅ Live and Working