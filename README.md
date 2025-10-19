# Sajeevan Veeriah - Interactive Engineering Portfolio

A modern, responsive portfolio website showcasing mechatronics engineering expertise, projects, and professional experience.

## 🎯 Features

- **Interactive Particle Background**: Dynamic animated particles with connection effects
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Scroll-triggered animations and transitions
- **Modern UI/UX**: Dark theme with vibrant accent colors
- **Project Showcase**: Detailed project cards with technology tags
- **Professional Timeline**: Visual experience timeline
- **Contact Form**: Integrated email contact system
- **Performance Optimized**: Fast loading with lazy loading and optimized assets

## 📁 Project Structure

```
sajeevanveeriah.github.io/
│
├── index.html              # Main HTML file
├── styles.css              # Complete stylesheet
├── script.js               # JavaScript interactions
├── README.md               # This file
│
└── assets/                 # Asset folder (to be created)
    ├── Sajeevan_Veeriah_Resume.pdf
    ├── project-placeholder-1.jpg
    ├── project-placeholder-2.jpg
    ├── project-placeholder-3.jpg
    ├── project-placeholder-4.jpg
    ├── project-placeholder-5.jpg
    └── project-placeholder-6.jpg
```

## 🚀 Implementation Guide

### Step 1: Prepare Your GitHub Repository

1. **Go to your existing GitHub repository**:
   - Navigate to: https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io

2. **Delete old files** (if you want to start fresh):
   - Go to your repository on GitHub
   - Click on each file and delete it
   - Or use Git command: `git rm *` (from your local clone)

### Step 2: Set Up Local Files

1. **Create a new folder on your computer**:
   ```bash
   mkdir portfolio-website
   cd portfolio-website
   ```

2. **Create the three main files**:
   - Create `index.html` and paste the HTML code I provided
   - Create `styles.css` and paste the CSS code I provided
   - Create `script.js` and paste the JavaScript code I provided

3. **Create the assets folder**:
   ```bash
   mkdir assets
   ```

4. **Add your resume**:
   - Copy your PDF resume into the `assets` folder
   - Rename it to: `Sajeevan_Veeriah_Resume.pdf`

### Step 3: Add Placeholder Images (Temporary)

Since you'll organize your project images later, the website will automatically show colored placeholders with project names. The images will display as SVG placeholders until you replace them.

**When you're ready to add real images:**
1. Save your project images as JPG or PNG files
2. Name them:
   - `project-placeholder-1.jpg` (Clinical Ataxia Device)
   - `project-placeholder-2.jpg` (Autonomous Rover)
   - `project-placeholder-3.jpg` (IoT Systems)
   - `project-placeholder-4.jpg` (GPS Tracker)
   - `project-placeholder-5.jpg` (Automotive Testing)
   - `project-placeholder-6.jpg` (PLC Automation)
3. Place them in the `assets` folder

### Step 4: Initialize Git and Push to GitHub

1. **Open terminal in your project folder**:
   ```bash
   cd portfolio-website
   ```

2. **Initialize Git**:
   ```bash
   git init
   ```

3. **Add all files**:
   ```bash
   git add .
   ```

4. **Commit changes**:
   ```bash
   git commit -m "Initial commit: Interactive engineering portfolio"
   ```

5. **Connect to your GitHub repository**:
   ```bash
   git remote add origin https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io.git
   ```

6. **Push to GitHub** (force push if needed to overwrite old content):
   ```bash
   git branch -M main
   git push -f origin main
   ```

### Step 5: Enable GitHub Pages

1. **Go to your repository on GitHub**:
   - Navigate to: https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io

2. **Go to Settings**:
   - Click on "Settings" tab

3. **Navigate to Pages**:
   - In the left sidebar, click "Pages"

4. **Configure source**:
   - Under "Branch", select `main`
   - Select folder: `/ (root)`
   - Click "Save"

5. **Wait a few minutes**:
   - GitHub will build and deploy your site
   - Your site will be available at: https://sajeevanveeriah.github.io

### Step 6: Verify Deployment

1. **Visit your website**:
   - Go to: https://sajeevanveeriah.github.io

2. **Check all sections**:
   - ✅ Navigation works smoothly
   - ✅ Particle animation appears
   - ✅ All sections load properly
   - ✅ Mobile menu works on phone
   - ✅ Contact form opens email client

## 🔄 Updating Your Website

### To Update Content:

1. **Edit the files locally**:
   - Open `index.html` in a text editor
   - Make your changes
   - Save the file

2. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update: describe what you changed"
   git push origin main
   ```

3. **Wait 1-2 minutes**:
   - GitHub Pages will automatically rebuild
   - Refresh your browser to see changes

### To Add Project Images:

1. **Prepare your images**:
   - Resize to reasonable dimensions (1200x800 pixels recommended)
   - Optimize file size (use TinyPNG.com or similar)
   - Save as JPG or PNG

2. **Add to assets folder**:
   - Place images in the `assets` folder
   - Name them `project-1.jpg`, `project-2.jpg`, etc.

3. **Update HTML**:
   - In `index.html`, find the project image tags
   - Change `src="assets/project-placeholder-1.jpg"` to `src="assets/project-1.jpg"`

4. **Push to GitHub**:
   ```bash
   git add assets/
   git commit -m "Add project images"
   git push origin main
   ```

## 📱 Testing Your Website

### Desktop Testing:
- Open in Chrome, Firefox, Safari, and Edge
- Test all navigation links
- Verify animations work smoothly
- Test contact form

### Mobile Testing:
- Open on your phone: https://sajeevanveeriah.github.io
- Test mobile menu (hamburger icon)
- Verify touch interactions work
- Check responsive layout

### Performance Testing:
- Use Google PageSpeed Insights: https://pagespeed.web.dev/
- Paste your URL and check scores
- Aim for 90+ scores

## 🎨 Customization Guide

### Changing Colors:

Edit the `:root` section in `styles.css`:
```css
:root {
    --primary-color: #00d4ff;      /* Main accent color */
    --secondary-color: #ff6b35;    /* Secondary accent */
    --accent-color: #7c3aed;       /* Purple accent */
}
```

### Adding New Projects:

1. In `index.html`, find the `projects-grid` section
2. Copy an existing `project-card` div
3. Update the content:
   - Project title
   - Description
   - Technology badges
   - Image source
   - GitHub/demo links

### Updating Contact Information:

Search for these in `index.html` and update:
- Email: `sajeevanveeriah@gmail.com`
- Phone: `+61 498 586 654`
- Location: `Highton, VIC 3216`
- LinkedIn: Your LinkedIn URL
- GitHub: Your GitHub URL

## 🔧 Troubleshooting

### Website Not Loading:
1. Wait 5 minutes after pushing to GitHub
2. Check GitHub Actions tab for build status
3. Verify GitHub Pages is enabled in Settings
4. Try clearing browser cache (Ctrl+Shift+R)

### Images Not Showing:
1. Verify images are in the `assets` folder
2. Check file names match exactly (case-sensitive)
3. Ensure you pushed the assets folder to GitHub
4. Check file extensions (.jpg, .png, not .JPG or .PNG)

### Contact Form Not Working:
- The form opens the default email client
- Ensure you have an email app configured
- On mobile, it should open Gmail/Mail app

### Particle Animation Not Working:
- Check browser console for errors (F12 key)
- Ensure JavaScript is enabled
- Try a different browser

## 📊 Performance Optimization

### Image Optimization:
- Use TinyPNG: https://tinypng.com/
- Recommended size: 1200x800 pixels
- Format: JPG for photos, PNG for graphics
- Max file size: 500KB per image

### Loading Speed:
- Current setup is optimized
- All CSS and JS are minified
- Images load lazily
- Fonts load from CDN

## 🔐 Security Best Practices

- Never commit sensitive information
- No API keys needed for this site
- Contact form uses mailto (secure)
- All external links use `rel="noopener noreferrer"`

## 📈 Adding Analytics (Optional)

To track visitors, add Google Analytics:

1. **Get Google Analytics ID**:
   - Go to: https://analytics.google.com/
   - Create property
   - Get tracking ID (G-XXXXXXXXXX)

2. **Add to HTML**:
   - Open `index.html`
   - Add before closing `</head>` tag:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## 🌐 Custom Domain (Optional)

To use a custom domain like `sajeevanveeriah.com`:

1. **Buy domain** from:
   - Namecheap
   - Google Domains
   - GoDaddy

2. **Configure DNS**:
   - Add A records pointing to:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Add CNAME record: `www` → `sajeevanveeriah.github.io`

3. **Update GitHub Pages**:
   - Settings → Pages → Custom domain
   - Enter your domain
   - Enable "Enforce HTTPS"

## 📞 Support

If you encounter issues:

1. **Check GitHub Pages status**: https://www.githubstatus.com/
2. **Review GitHub Actions logs** in your repository
3. **Test in incognito/private browser window**
4. **Clear browser cache completely**

## 📝 Quick Reference Commands

```bash
# Clone your repository
git clone https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io.git
cd sajeevanveeriah.github.io

# Make changes and update
git add .
git commit -m "Your message here"
git push origin main

# Check status
git status

# Pull latest changes
git pull origin main
```

## ✅ Final Checklist

Before going live:
- [ ] All personal information is correct
- [ ] Resume PDF is uploaded
- [ ] All links work (LinkedIn, GitHub, email)
- [ ] Mobile menu works on phone
- [ ] Contact form opens email client
- [ ] Website loads in under 3 seconds
- [ ] No console errors (F12 to check)
- [ ] Tested on multiple browsers
- [ ] Tested on mobile device

## 🎉 You're Done!

Your portfolio is now live at: **https://sajeevanveeriah.github.io**

Share your link on:
- LinkedIn profile (Featured section)
- Resume (add URL at top)
- Email signature
- Job applications

---

**Built with**: HTML5, CSS3, Vanilla JavaScript  
**Hosted on**: GitHub Pages  
**Last Updated**: October 2025

For questions or updates, refer to this README file.
