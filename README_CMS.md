# Serverless CMS for Portfolio

## Overview

Your portfolio now includes a **Serverless CMS (Content Management System)** that allows you to edit content directly from the website itself. The website acts as its own editor, using the GitHub API to update the `data.json` file without any external tools or servers.

## Features

✅ **Hidden Admin Interface** - Discreet access point in the footer  
✅ **Passcode Protection** - 4-digit PIN for security  
✅ **GitHub Integration** - Automatically commits changes to your repository  
✅ **Modal Forms** - User-friendly forms for adding content  
✅ **No External Tools** - Everything happens in the browser  
✅ **Real-time Updates** - Changes reflect immediately after page reload  

## How It Works

### For Visitors (Public Perspective)
- The site appears as a normal, polished portfolio
- No indication of the CMS exists
- All content is static and fast-loading

### For Admin (You)

#### 1. **Activating Admin Mode**

1. Scroll to the bottom of your portfolio
2. Look for a tiny dot (•) in the footer next to "Terms of Service" - it's almost invisible (opacity: 0.05)
3. Click on the dot
4. Enter the 4-digit passcode: **1234** (you can change this in `cms.js`)
5. On first use, you'll be asked for a GitHub Personal Access Token

#### 2. **Setting Up GitHub Token**

You need a GitHub Personal Access Token to allow the CMS to write to your repository:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio CMS"
4. Check the **`repo`** permission (full control of private repositories)
5. Generate and copy the token
6. Paste it when prompted during first admin login

**Important:** The token is stored securely in your browser's localStorage and never shared.

#### 3. **Using the CMS**

Once in admin mode:
- The page will have a **dashed blue outline**
- **"Add" buttons** appear above each section:
  - "Add Certification" in the About Me section
  - "Add Data Science Project" in the Projects section
  - "Add AI Business Project" in the AI Projects section

#### 4. **Adding Content**

1. Click any "Add" button
2. Fill in the modal form with your content
3. Click "Save to GitHub"
4. The CMS will:
   - Fetch the current `data.json` from GitHub
   - Append your new entry
   - Create a commit with the changes
   - Push back to GitHub
5. Page will auto-reload to show the new content

#### 5. **Exiting Admin Mode**

Open browser console (F12) and type:
```javascript
CMS.exitAdminMode()
```

Or simply refresh the page.

## File Structure

```
portfolio/
├── index.html          # Main portfolio page
├── data.json          # Dynamic content storage (managed by CMS)
├── cms.js             # CMS functionality
├── script.js          # Original portfolio scripts
├── styles.css         # Styles
└── README_CMS.md      # This file
```

## Configuration

### Changing the Passcode

Edit `cms.js` line 9:
```javascript
PASSCODE: '1234', // Change to your preferred 4-digit code
```

### Changing Repository Details

Edit `cms.js` lines 11-14:
```javascript
REPO_OWNER: 'Svamsi2006',
REPO_NAME: 'Svamsi2006',
DATA_FILE_PATH: 'data.json',
BRANCH: 'main'
```

## Security Features

1. **Hidden Admin Button** - Almost invisible to prevent accidental discovery
2. **Passcode Protection** - 4-digit PIN required
3. **Token Storage** - GitHub token stored locally, not in code
4. **Visual Indicator** - Blue outline shows when in admin mode
5. **Token Management** - Can clear token via console: `CMS.clearToken()`

## Data Structure

The `data.json` file contains:

```json
{
  "certifications": [
    {
      "id": 1,
      "title": "Certification Name",
      "issuer": "Organization",
      "date": "2025",
      "icon": "fas fa-certificate",
      "link": "https://..."
    }
  ],
  "projects": {
    "dataScience": [
      {
        "id": 1,
        "title": "Project Title",
        "description": "Project description",
        "image": "image-url.jpg",
        "imageAlt": "Alt text",
        "liveDemo": "https://...",
        "github": "https://...",
        "technologies": ["Tech1", "Tech2"]
      }
    ],
    "aiBusiness": []
  },
  "skills": {...},
  "education": [...]
}
```

## Troubleshooting

### "Failed to save to GitHub"
- **Check token permissions**: Ensure `repo` scope is enabled
- **Verify repository name**: Must match exactly
- **Check internet connection**: GitHub API requires connectivity

### "GitHub token not configured"
- Clear browser cache
- Run `CMS.clearToken()` in console
- Re-activate admin mode and enter token again

### Modal not appearing
- Check browser console for errors
- Ensure `cms.js` is loaded (check Network tab)
- Verify modal HTML was created (inspect page)

### Token lost after browser clear
- This is normal - token is in localStorage
- Re-enter token when prompted

## Advanced Usage

### Console Commands

Open browser console (F12) and use:

```javascript
// View current portfolio data
CMS.portfolioData()

// Exit admin mode
CMS.exitAdminMode()

// Clear stored GitHub token
CMS.clearToken()

// Manually toggle admin mode
CMS.toggleAdminMode(true)  // or false
```

## Future Enhancements

Potential additions to the CMS:

- [ ] Edit existing items (not just add)
- [ ] Delete items
- [ ] Drag-and-drop reordering
- [ ] Image upload to GitHub
- [ ] Bulk operations
- [ ] Undo/redo functionality
- [ ] Preview before save
- [ ] Rich text editor for descriptions
- [ ] Export/import functionality

## Important Notes

⚠️ **Security Warning:** 
- Keep your GitHub token private
- Change the default passcode
- Don't share admin access

⚠️ **Backup:**
- GitHub keeps version history of all changes
- You can revert changes via Git if needed

⚠️ **Limitations:**
- Only adds new items (editing/deleting requires code modification)
- Requires internet connection
- GitHub API has rate limits (60 requests/hour unauthenticated, 5000 with token)

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify GitHub token permissions
3. Ensure `data.json` exists in repository
4. Check repository settings (should be public or token should have access)

---

**Built with:** Vanilla JavaScript, GitHub API, and lots of ❤️

**Made by:** Vamsi Siva Ganesh Seelam  
**Last Updated:** December 15, 2025
