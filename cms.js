/**
 * Serverless CMS System for Portfolio
 * Allows editing the portfolio content directly from the website using GitHub API
 */

// Configuration
const CMS_CONFIG = {
    PASSCODE: '1234', // Change this to your desired 4-digit passcode
    GITHUB_TOKEN: '', // Will be set by user during first admin login
    REPO_OWNER: 'Svamsi2006',
    REPO_NAME: 'Svamsi2006',
    DATA_FILE_PATH: 'data.json',
    BRANCH: 'main'
};

// State Management
let isAdminMode = false;
let portfolioData = null;

// Check for private config (if cms-config.private.js is loaded)
let githubToken = '';
if (window.CMS_PRIVATE_CONFIG && window.CMS_PRIVATE_CONFIG.GITHUB_TOKEN) {
    githubToken = window.CMS_PRIVATE_CONFIG.GITHUB_TOKEN;
    CMS_CONFIG.GITHUB_TOKEN = githubToken;
    console.log('🔐 Using pre-configured GitHub token from private config');
} else {
    githubToken = localStorage.getItem('cms_github_token') || '';
}

// Initialize CMS on page load
document.addEventListener('DOMContentLoaded', initializeCMS);

function initializeCMS() {
    // Load portfolio data
    loadPortfolioData();
    
    // Setup admin trigger
    const adminTrigger = document.getElementById('adminTrigger');
    if (adminTrigger) {
        adminTrigger.addEventListener('click', handleAdminTrigger);
    }
    
    // Create modal HTML
    createModalHTML();
    
    // Add admin buttons (hidden by default)
    addAdminButtons();
}

// Admin Authentication
function handleAdminTrigger() {
    const passcode = prompt('Enter 4-digit admin passcode:');
    
    if (passcode === CMS_CONFIG.PASSCODE) {
        // Check if GitHub token exists
        if (!githubToken) {
            const token = prompt('First time setup: Enter your GitHub Personal Access Token (classic) with repo permissions:');
            if (token) {
                githubToken = token;
                localStorage.setItem('cms_github_token', token);
                CMS_CONFIG.GITHUB_TOKEN = token;
            } else {
                alert('GitHub token is required to use the CMS.');
                return;
            }
        } else {
            CMS_CONFIG.GITHUB_TOKEN = githubToken;
        }
        
        toggleAdminMode(true);
        alert('Admin mode activated! You can now add and edit content.');
    } else {
        alert('Incorrect passcode!');
    }
}

function toggleAdminMode(enabled) {
    isAdminMode = enabled;
    const adminButtons = document.querySelectorAll('.cms-admin-btn');
    
    adminButtons.forEach(btn => {
        btn.style.display = enabled ? 'inline-block' : 'none';
    });
    
    // Add visual indicator
    if (enabled) {
        document.body.style.outline = '3px dashed #0bd9f4';
        document.body.style.outlineOffset = '-3px';
    } else {
        document.body.style.outline = 'none';
    }
}

// Load Portfolio Data
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        console.log('Portfolio data loaded:', portfolioData);
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        portfolioData = {
            certifications: [],
            projects: { dataScience: [], aiBusiness: [] },
            skills: {},
            education: []
        };
    }
}

// Add Admin Buttons to Sections
function addAdminButtons() {
    // Add to Certifications section (in personal info)
    const personalInfo = document.querySelector('.personal-info');
    if (personalInfo) {
        const addCertBtn = createAdminButton('Add Certification', () => openAddModal('certification'));
        personalInfo.appendChild(addCertBtn);
    }
    
    // Add to Projects section
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        const addProjectBtn = createAdminButton('Add Data Science Project', () => openAddModal('project-ds'));
        projectsGrid.parentElement.insertBefore(addProjectBtn, projectsGrid);
    }
    
    // Add to AI Projects section
    const aiProjectsSection = document.querySelector('#ai-business-projects .projects-grid');
    if (aiProjectsSection) {
        const addAIProjectBtn = createAdminButton('Add AI Business Project', () => openAddModal('project-ai'));
        aiProjectsSection.parentElement.insertBefore(addAIProjectBtn, aiProjectsSection);
    }
}

function createAdminButton(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'cms-admin-btn btn btn-primary';
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> ${text}`;
    btn.style.display = 'none';
    btn.style.margin = '1rem 0';
    btn.addEventListener('click', onClick);
    return btn;
}

// Modal Creation
function createModalHTML() {
    const modalHTML = `
        <div id="cmsModal" class="cms-modal" style="display: none;">
            <div class="cms-modal-content">
                <span class="cms-modal-close">&times;</span>
                <h2 id="cmsModalTitle">Add Item</h2>
                <form id="cmsForm">
                    <div id="cmsFormFields"></div>
                    <div class="cms-form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save to GitHub
                        </button>
                        <button type="button" class="btn btn-secondary cms-cancel">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal event listeners
    document.querySelector('.cms-modal-close').addEventListener('click', closeModal);
    document.querySelector('.cms-cancel').addEventListener('click', closeModal);
    document.getElementById('cmsForm').addEventListener('submit', handleFormSubmit);
    
    // Close on outside click
    document.getElementById('cmsModal').addEventListener('click', (e) => {
        if (e.target.id === 'cmsModal') closeModal();
    });
    
    // Add modal styles
    addModalStyles();
}

function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cms-modal {
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .cms-modal-content {
            background: linear-gradient(135deg, rgba(13, 13, 30, 0.95), rgba(26, 26, 46, 0.95));
            margin: 5% auto;
            padding: 2rem;
            border: 1px solid rgba(11, 217, 244, 0.3);
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(11, 217, 244, 0.2);
        }
        
        .cms-modal-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .cms-modal-close:hover {
            color: #0bd9f4;
        }
        
        #cmsModalTitle {
            color: #0bd9f4;
            margin-bottom: 1.5rem;
        }
        
        .cms-form-group {
            margin-bottom: 1.5rem;
        }
        
        .cms-form-group label {
            display: block;
            color: #fff;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .cms-form-group input,
        .cms-form-group textarea,
        .cms-form-group select {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(11, 217, 244, 0.2);
            border-radius: 8px;
            color: #fff;
            font-family: 'Poppins', sans-serif;
            transition: border-color 0.3s;
        }
        
        .cms-form-group input:focus,
        .cms-form-group textarea:focus {
            outline: none;
            border-color: #0bd9f4;
        }
        
        .cms-form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .cms-form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .cms-form-actions .btn {
            flex: 1;
        }
        
        .cms-admin-btn {
            background: linear-gradient(135deg, #0bd9f4, #00b4d8);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .cms-admin-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(11, 217, 244, 0.3);
        }
        
        .cms-tech-input {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .cms-tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .cms-tech-tag {
            background: rgba(11, 217, 244, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            color: #0bd9f4;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cms-tech-tag .remove {
            cursor: pointer;
            color: #ff4444;
        }
    `;
    document.head.appendChild(style);
}

// Modal Functions
let currentModalType = '';

function openAddModal(type) {
    currentModalType = type;
    const modal = document.getElementById('cmsModal');
    const title = document.getElementById('cmsModalTitle');
    const formFields = document.getElementById('cmsFormFields');
    
    // Set title
    const titles = {
        'certification': 'Add Certification',
        'project-ds': 'Add Data Science Project',
        'project-ai': 'Add AI Business Project'
    };
    title.textContent = titles[type] || 'Add Item';
    
    // Generate form fields based on type
    formFields.innerHTML = generateFormFields(type);
    
    // Show modal
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('cmsModal').style.display = 'none';
    document.getElementById('cmsForm').reset();
    currentModalType = '';
}

function generateFormFields(type) {
    if (type === 'certification') {
        return `
            <div class="cms-form-group">
                <label>Certification Title *</label>
                <input type="text" name="title" required>
            </div>
            <div class="cms-form-group">
                <label>Issuing Organization</label>
                <input type="text" name="issuer">
            </div>
            <div class="cms-form-group">
                <label>Date</label>
                <input type="text" name="date" placeholder="e.g., 2025">
            </div>
            <div class="cms-form-group">
                <label>Icon (Font Awesome class)</label>
                <input type="text" name="icon" value="fas fa-certificate">
            </div>
            <div class="cms-form-group">
                <label>Link (optional)</label>
                <input type="url" name="link">
            </div>
        `;
    } else if (type === 'project-ds' || type === 'project-ai') {
        return `
            <div class="cms-form-group">
                <label>Project Title *</label>
                <input type="text" name="title" required>
            </div>
            <div class="cms-form-group">
                <label>Description *</label>
                <textarea name="description" required></textarea>
            </div>
            <div class="cms-form-group">
                <label>Image URL *</label>
                <input type="url" name="image" required>
            </div>
            <div class="cms-form-group">
                <label>Image Alt Text</label>
                <input type="text" name="imageAlt">
            </div>
            <div class="cms-form-group">
                <label>Live Demo URL</label>
                <input type="url" name="liveDemo">
            </div>
            <div class="cms-form-group">
                <label>GitHub URL</label>
                <input type="url" name="github">
            </div>
            <div class="cms-form-group">
                <label>Technologies (comma-separated)</label>
                <input type="text" name="technologies" placeholder="e.g., Python, TensorFlow, React">
            </div>
        `;
    }
}

// Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!CMS_CONFIG.GITHUB_TOKEN) {
        alert('GitHub token not configured. Please restart admin mode.');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Process the data based on type
    const newItem = processFormData(currentModalType, data);
    
    // Update portfolio data
    updatePortfolioData(currentModalType, newItem);
    
    // Save to GitHub
    await saveToGitHub();
    
    // Close modal
    closeModal();
}

function processFormData(type, data) {
    const newItem = { ...data };
    
    // Add unique ID
    newItem.id = Date.now();
    
    // Process technologies array for projects
    if (type === 'project-ds' || type === 'project-ai') {
        if (data.technologies) {
            newItem.technologies = data.technologies.split(',').map(t => t.trim());
        } else {
            newItem.technologies = [];
        }
    }
    
    return newItem;
}

function updatePortfolioData(type, newItem) {
    if (type === 'certification') {
        portfolioData.certifications.push(newItem);
    } else if (type === 'project-ds') {
        portfolioData.projects.dataScience.push(newItem);
    } else if (type === 'project-ai') {
        portfolioData.projects.aiBusiness.push(newItem);
    }
}

// GitHub API Integration
async function saveToGitHub() {
    try {
        // Show loading state
        showLoadingIndicator();
        
        console.log('🔧 CMS Debug Info:');
        console.log('Repository:', `${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}`);
        console.log('File Path:', CMS_CONFIG.DATA_FILE_PATH);
        console.log('Branch:', CMS_CONFIG.BRANCH);
        console.log('Token configured:', !!CMS_CONFIG.GITHUB_TOKEN);
        
        // Step 1: Get current file SHA
        console.log('📥 Fetching current file from GitHub...');
        const fileData = await getFileFromGitHub();
        const currentSHA = fileData.sha;
        console.log('✅ File SHA retrieved:', currentSHA.substring(0, 8) + '...');
        
        // Step 2: Prepare new content
        const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(portfolioData, null, 2))));
        console.log('📝 Content prepared, size:', newContent.length, 'bytes');
        
        // Step 3: Commit changes
        const apiUrl = `https://api.github.com/repos/${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}/contents/${CMS_CONFIG.DATA_FILE_PATH}`;
        console.log('📤 Pushing to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${CMS_CONFIG.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `✨ Update portfolio data - Added new item via CMS [${new Date().toISOString()}]`,
                content: newContent,
                sha: currentSHA,
                branch: CMS_CONFIG.BRANCH
            })
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ GitHub commit successful:', result.commit.sha);
            hideLoadingIndicator();
            alert('✅ Successfully saved to GitHub!\n\nCommit: ' + result.commit.sha.substring(0, 8) + '\n\nThe page will reload to show the changes.');
            setTimeout(() => window.location.reload(), 1500);
        } else {
            const error = await response.json();
            console.error('❌ GitHub API Error Response:', error);
            throw new Error(error.message || `Failed to save (${response.status})`);
        }
    } catch (error) {
        hideLoadingIndicator();
        console.error('❌ GitHub API Error:', error);
        
        let errorMsg = `Error: ${error.message}`;
        
        if (error.message.includes('404')) {
            errorMsg += '\n\n❌ File not found. Make sure data.json exists in your repository.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            errorMsg += '\n\n❌ Authentication failed. Check your token permissions.';
        } else if (error.message.includes('409')) {
            errorMsg += '\n\n❌ Conflict detected. The file may have been modified. Please refresh and try again.';
        }
        
        alert(`❌ Failed to save to GitHub\n\n${errorMsg}\n\nRepository: ${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}\nFile: ${CMS_CONFIG.DATA_FILE_PATH}\n\nCheck browser console for details.`);
    }
}

async function getFileFromGitHub() {
    const apiUrl = `https://api.github.com/repos/${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}/contents/${CMS_CONFIG.DATA_FILE_PATH}?ref=${CMS_CONFIG.BRANCH}`;
    
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${CMS_CONFIG.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch file:', error);
        throw new Error(`Failed to fetch file from GitHub (${response.status}): ${error.message || response.statusText}`);
    }
    
    return await response.json();
}

// Loading Indicator
function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'cmsLoader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(13, 13, 30, 0.95);
            padding: 2rem 3rem;
            border-radius: 16px;
            border: 1px solid rgba(11, 217, 244, 0.3);
            z-index: 10001;
            text-align: center;
        ">
            <div class="loader" style="margin-bottom: 1rem;">
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="circle"></div>
            </div>
            <p style="color: #0bd9f4; font-weight: 600;">Saving to GitHub...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('cmsLoader');
    if (loader) loader.remove();
}

// Exit Admin Mode (optional - can add a button for this)
function exitAdminMode() {
    toggleAdminMode(false);
    alert('Admin mode deactivated.');
}

// Export for console access
window.CMS = {
    exitAdminMode,
    toggleAdminMode,
    portfolioData: () => portfolioData,
    clearToken: () => {
        localStorage.removeItem('cms_github_token');
        githubToken = '';
        alert('GitHub token cleared. You will need to re-enter it on next admin login.');
    }
};

console.log('🎨 Serverless CMS loaded! Use CMS.exitAdminMode() to exit admin mode.');
