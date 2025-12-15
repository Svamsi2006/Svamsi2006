# 🚀 Quick Start Guide - Portfolio CMS

## Get Started in 3 Steps!

### Step 1: Get Your GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `Portfolio CMS`
4. Select scope: ✅ **repo** (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Activate Admin Mode

1. Open your portfolio: https://vamsisivaganesh.vercel.app
2. Scroll to the very bottom
3. Look for a tiny dot (•) next to "Terms of Service"
4. Click it
5. Enter passcode: `1234`
6. Paste your GitHub token when prompted

### Step 3: Add Content!

- Click **"Add Certification"** to add certifications
- Click **"Add Data Science Project"** to add projects
- Click **"Add AI Business Project"** to add AI projects

Fill in the form and click **"Save to GitHub"** - Done! 🎉

---

## ⚡ Quick Tips

- **Can't find the admin dot?** Hover near the footer links - it's almost invisible!
- **Forgot passcode?** Default is `1234` - change it in `cms.js`
- **Want to exit?** Console: `CMS.exitAdminMode()`
- **Lost token?** Console: `CMS.clearToken()` then re-login

## 🎨 What You Can Add

### Certifications
- Title, Issuer, Date, Link

### Projects
- Title, Description, Image, Live Demo, GitHub, Technologies

---

**That's it! Your portfolio is now self-updating! 🚀**

For detailed docs, see [README_CMS.md](README_CMS.md)
