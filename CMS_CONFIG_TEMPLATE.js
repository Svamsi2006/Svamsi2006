/**
 * CMS Configuration Template
 * Copy these settings and paste into cms.js if you want to customize
 */

// ============================================
// BASIC CONFIGURATION
// ============================================

// 1. CHANGE YOUR PASSCODE (Line 9 in cms.js)
PASSCODE: '1234',  // ⚠️ CHANGE THIS to your own 4-digit code

// 2. REPOSITORY SETTINGS (Lines 11-14 in cms.js)
REPO_OWNER: 'Svamsi2006',      // Your GitHub username
REPO_NAME: 'Svamsi2006',       // Your repository name
DATA_FILE_PATH: 'data.json',   // Path to data file
BRANCH: 'main',                 // Your main branch name

// ============================================
// ADVANCED CUSTOMIZATION
// ============================================

// 3. To add more content types, add to the addAdminButtons() function:

/*
// Example: Add a "Skills" section button
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const addSkillBtn = createAdminButton('Add Skill', () => openAddModal('skill'));
    skillsSection.appendChild(addSkillBtn);
}
*/

// 4. To add form fields for new content types, update generateFormFields():

/*
} else if (type === 'skill') {
    return `
        <div class="cms-form-group">
            <label>Skill Name *</label>
            <input type="text" name="name" required>
        </div>
        <div class="cms-form-group">
            <label>Proficiency Level</label>
            <select name="level">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
            </select>
        </div>
    `;
}
*/

// 5. To update data structure, modify updatePortfolioData():

/*
} else if (type === 'skill') {
    if (!portfolioData.skills.custom) {
        portfolioData.skills.custom = [];
    }
    portfolioData.skills.custom.push(newItem);
}
*/

// ============================================
// STYLING CUSTOMIZATION
// ============================================

// 6. Modal colors (in addModalStyles() function):
/*
Change these CSS variables:
- Primary color: #0bd9f4 (change to your brand color)
- Background: rgba(13, 13, 30, 0.95) (modal background)
- Border: rgba(11, 217, 244, 0.3) (border color)
*/

// 7. Admin button style:
/*
.cms-admin-btn {
    background: linear-gradient(135deg, #0bd9f4, #00b4d8);  // Your colors
    // ... rest of styles
}
*/

// ============================================
// SECURITY SETTINGS
// ============================================

// 8. To add multiple admin passcodes:
/*
const ADMIN_PASSCODES = ['1234', '5678', '9999'];

function handleAdminTrigger() {
    const passcode = prompt('Enter 4-digit admin passcode:');
    
    if (ADMIN_PASSCODES.includes(passcode)) {
        // ... rest of code
    }
}
*/

// 9. To add passcode expiry:
/*
const PASSCODE_EXPIRY_HOURS = 24;

function isSessionValid() {
    const loginTime = localStorage.getItem('cms_login_time');
    if (!loginTime) return false;
    
    const hoursPassed = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
    return hoursPassed < PASSCODE_EXPIRY_HOURS;
}
*/

// ============================================
// FEATURE TOGGLES
// ============================================

// 10. Enable/disable features:
/*
const CMS_FEATURES = {
    CERTIFICATIONS: true,
    PROJECTS_DS: true,
    PROJECTS_AI: true,
    SKILLS: false,        // Not implemented yet
    EDUCATION: false,     // Not implemented yet
    BLOG_POSTS: false     // Future feature
};
*/

// ============================================
// COMMIT MESSAGE CUSTOMIZATION
// ============================================

// 11. Custom commit messages (in saveToGitHub() function):
/*
Change:
    message: `Update portfolio data - Added new item via CMS`,

To:
    message: `✨ Added ${currentModalType} via Portfolio CMS - ${new Date().toLocaleDateString()}`,
*/

// ============================================
// ERROR HANDLING
// ============================================

// 12. Custom error messages:
/*
const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection.',
    TOKEN: 'Invalid GitHub token. Please check permissions.',
    RATE_LIMIT: 'GitHub rate limit exceeded. Try again later.',
    GENERIC: 'Something went wrong. Please try again.'
};
*/

// ============================================
// VALIDATION RULES
// ============================================

// 13. Add custom validation:
/*
function validateProjectData(data) {
    const errors = [];
    
    if (data.title.length < 5) {
        errors.push('Title must be at least 5 characters');
    }
    
    if (!data.image.startsWith('http')) {
        errors.push('Image must be a valid URL');
    }
    
    return errors;
}
*/

// ============================================
// QUICK REFERENCE
// ============================================

/*
File Structure:
├── index.html       - Has <span id="adminTrigger"> in footer
├── cms.js          - Main CMS logic (customize here)
├── data.json       - Your portfolio data
├── styles.css      - Has #adminTrigger styles
└── README_CMS.md   - Documentation

Key Functions:
- handleAdminTrigger()  - Passcode check
- toggleAdminMode()     - Show/hide admin UI
- openAddModal()        - Open form modal
- saveToGitHub()        - GitHub API integration
- updatePortfolioData() - Update data structure

Console Commands:
CMS.exitAdminMode()
CMS.portfolioData()
CMS.clearToken()
CMS.toggleAdminMode(true/false)
*/

// ============================================
// SUPPORT
// ============================================

/*
If you need help:
1. Check README_CMS.md for full documentation
2. Open browser console (F12) for error messages
3. Check GitHub token has 'repo' permissions
4. Verify repository name matches exactly
5. Test with simple data first

GitHub Token Scopes Needed:
✅ repo (full control of private repositories)
   ├── repo:status
   ├── repo_deployment
   ├── public_repo
   └── repo:invite

Optional but recommended:
✅ workflow (if you use GitHub Actions)
*/
