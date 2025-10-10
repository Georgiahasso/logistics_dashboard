# Deploy to GitHub Pages 🐙

Quick guide to get your dashboard live on GitHub Pages!

---

## ✅ Prerequisites Done

I've already configured:

- ✅ `gh-pages` package installed
- ✅ Deploy scripts added to `package.json`
- ✅ Vite base path configured
- ✅ Build tested and working

---

## 🚀 Deploy Steps

### **Step 1: Initialize Git** (if not done)

```bash
git init
git add .
git commit -m "Logistics Dashboard v3.0 - Ready to deploy"
```

### **Step 2: Create GitHub Repository**

1. Go to https://github.com/new
2. Repository name: **logistics_dashboard**
3. Description: "Advanced Logistics Intelligence Dashboard with Predictive Analytics"
4. Keep it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click **"Create repository"**

### **Step 3: Push to GitHub**

GitHub will show you commands like this - run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/logistics_dashboard.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### **Step 4: Deploy to GitHub Pages**

```bash
npm run deploy
```

This will:

- Build your app
- Create a `gh-pages` branch
- Push the built files to GitHub
- Take about 30 seconds

### **Step 5: Enable GitHub Pages**

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: Select **`gh-pages`**
   - Folder: **`/ (root)`**
5. Click **Save**

### **Step 6: Wait & Access**

- Wait 1-2 minutes for GitHub to build
- Your dashboard will be live at:

```
https://YOUR_USERNAME.github.io/logistics_dashboard/
```

**Don't forget the trailing slash!**

---

## 🎯 Complete Command Sequence

Here's everything in order:

```bash
# 1. Initialize git (if needed)
git init
git add .
git commit -m "Initial deployment"

# 2. Add GitHub remote (replace YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/logistics_dashboard.git
git branch -M main
git push -u origin main

# 3. Deploy to GitHub Pages
npm run deploy

# 4. Then go to GitHub repo → Settings → Pages →
#    Source: gh-pages branch → Save

# Done! Wait 1-2 minutes, then visit:
# https://YOUR_USERNAME.github.io/logistics_dashboard/
```

---

## 🔄 Update Your Live Site

Whenever you make changes:

```bash
# Make your changes, then:
git add .
git commit -m "Update dashboard"
git push

# Deploy the updates
npm run deploy

# Live site updates in ~1 minute!
```

---

## 🔐 About Your CSV Data

Your `smart_logistics_dataset.csv` will be publicly accessible in the GitHub repository.

### **Want to keep it private?**

```bash
# Before initial commit, add to .gitignore:
echo "smart_logistics_dataset.csv" >> .gitignore

# Then commit without the CSV
git add .
git commit -m "Initial deployment (without data)"

# Users will upload their own CSV files via the dashboard
```

---

## ✅ Verification Checklist

After deployment, check:

- [ ] Dashboard loads at your GitHub Pages URL
- [ ] Upload CSV button works
- [ ] Can ask questions and see analytics
- [ ] Charts render properly
- [ ] All 12 analytics types work
- [ ] Mobile responsive (test on phone)

---

## 🆘 Troubleshooting

### **Issue: Page shows 404**

- Make sure you enabled Pages in Settings
- Check branch is `gh-pages` not `main`
- Wait 2-3 minutes for initial deployment

### **Issue: Styles don't load**

- Vite base path is configured (`base: '/logistics_dashboard/'`)
- Rebuild and redeploy: `npm run deploy`

### **Issue: Deploy command fails**

```bash
# Check git is set up
git remote -v

# Should show GitHub URL
# If not, add remote again
```

### **Issue: CSV upload doesn't work**

- This is normal - GitHub Pages is static only
- Users need to upload CSV through the browser
- Dashboard will work once they upload

---

## 🌐 Your Live URLs

After deployment, you'll have:

**Production Site:**

```
https://YOUR_USERNAME.github.io/logistics_dashboard/
```

**GitHub Repository:**

```
https://github.com/YOUR_USERNAME/logistics_dashboard
```

---

## 📊 What Happens

1. **You run `npm run deploy`**

   - Builds production version
   - Creates optimized bundle
   - Pushes to `gh-pages` branch

2. **GitHub Pages**

   - Detects new build
   - Deploys static files
   - Makes site live globally

3. **Users access**
   - Visit your URL
   - Upload their CSV
   - Analyze their data!

---

## 🎉 You're Ready!

Follow the steps above and your dashboard will be live on GitHub Pages!

**Time:** 5-10 minutes  
**Cost:** FREE  
**Result:** Professional live dashboard

---

**Need help? Just ask!** 🚀
