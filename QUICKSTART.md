# 🚀 QUICK START GUIDE
## Deploy Your Portfolio in 10 Minutes

### Prerequisites
- Git installed on your computer
- GitHub account (you already have this)
- Text editor (VS Code, Notepad++, or any editor)

---

## ⚡ Fast Track Deployment

### Option 1: Using GitHub Web Interface (Easiest - No Git Commands)

1. **Go to your repository**: https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io

2. **Delete all existing files**:
   - Click on each file
   - Click trash icon
   - Commit deletion

3. **Upload new files**:
   - Click "Add file" → "Upload files"
   - Drag and drop: `index.html`, `styles.css`, `script.js`
   - Click "Commit changes"

4. **Create assets folder**:
   - Click "Add file" → "Create new file"
   - Type: `assets/.gitkeep`
   - Click "Commit changes"

5. **Upload resume**:
   - Navigate into `assets` folder
   - Click "Add file" → "Upload files"
   - Upload your resume PDF
   - Rename to: `Sajeevan_Veeriah_Resume.pdf`
   - Click "Commit changes"

6. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: `main` branch, `/ (root)` folder
   - Click Save

7. **Wait 2-3 minutes**, then visit: https://sajeevanveeriah.github.io

---

### Option 2: Using Git Commands (Faster for updates)

**Step 1 - First Time Setup**:
```bash
# Create folder and navigate to it
mkdir portfolio
cd portfolio

# Copy the three files into this folder:
# - index.html
# - styles.css
# - script.js

# Initialize Git
git init
git add .
git commit -m "Initial portfolio upload"

# Connect to GitHub
git remote add origin https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io.git

# Push to GitHub (force overwrite)
git branch -M main
git push -f origin main
```

**Step 2 - Add Resume**:
```bash
# Create assets folder
mkdir assets

# Copy your resume PDF into assets folder
# Rename it to: Sajeevan_Veeriah_Resume.pdf

# Push to GitHub
git add assets/
git commit -m "Add resume"
git push origin main
```

**Step 3 - Enable GitHub Pages** (do this once):
- Go to: https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/settings/pages
- Source: `main` branch
- Click Save

**Step 4 - View Your Site**:
- Wait 2 minutes
- Visit: https://sajeevanveeriah.github.io

---

## 📝 Future Updates (Copy-Paste These Commands)

**Update website content**:
```bash
cd portfolio
# Make changes to files
git add .
git commit -m "Update content"
git push origin main
```

**Add project images**:
```bash
# Copy images to assets folder
git add assets/
git commit -m "Add project images"
git push origin main
```

---

## 🔍 Quick Checks

**Is it working?**
✅ Go to: https://sajeevanveeriah.github.io
✅ Particle animation should appear
✅ Navigation should work
✅ Mobile menu should work (on phone)

**If not working:**
1. Wait 5 more minutes (sometimes takes time)
2. Clear browser cache: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Check Settings → Pages to ensure it's enabled

---

## 📱 Share Your Portfolio

Add to your:
- ✅ LinkedIn (Featured section + About)
- ✅ Resume header (top right)
- ✅ Email signature
- ✅ Job applications

**Link**: https://sajeevanveeriah.github.io

---

## ⚙️ Customization Tips

**Change colors**: Edit `:root` section in `styles.css`

**Add new section**: Copy-paste similar section in `index.html`

**Update info**: Search for old info and replace in `index.html`

**Add projects**: Copy a `project-card` div and modify

---

## 🆘 Common Issues

**Problem**: Website shows 404
**Solution**: 
- Ensure GitHub Pages is enabled
- Check branch is set to `main`
- Wait 5 minutes after enabling

**Problem**: Images not showing
**Solution**:
- Verify files are in `assets` folder
- Check file names match exactly
- Images show as colored placeholders by default (SVG fallback)

**Problem**: Changes not appearing
**Solution**:
- Hard refresh: Ctrl+Shift+R
- Check you pushed to GitHub: `git status`
- Wait 2 minutes for GitHub to rebuild

---

## 💡 Pro Tips

1. **Test on mobile**: Open site on your phone immediately
2. **Check all links**: Click every link to verify they work
3. **Update regularly**: Keep projects and experience current
4. **Monitor performance**: Use Google PageSpeed Insights
5. **Backup files**: Keep local copies of all files

---

## 📞 Need Help?

**GitHub Pages Docs**: https://docs.github.com/en/pages
**Git Basics**: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
**HTML/CSS Help**: https://developer.mozilla.org/en-US/

---

## ✅ Success Checklist

- [ ] Files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] Website loads at https://sajeevanveeriah.github.io
- [ ] Resume PDF accessible
- [ ] Mobile menu works
- [ ] All navigation links work
- [ ] Contact form works
- [ ] Animations smooth
- [ ] Tested on phone
- [ ] Shared on LinkedIn

---

**Your live site**: https://sajeevanveeriah.github.io

**Time to deploy**: 10 minutes
**Time to customize**: As needed
**Cost**: $0 (completely free!)

🎉 **Congratulations! Your portfolio is live!**
