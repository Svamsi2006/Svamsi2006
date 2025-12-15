/**
 * CMS Debug & Test Script
 * Run this in the browser console to test CMS setup
 */

async function testCMSSetup() {
    console.log('🧪 Testing CMS Setup...\n');
    
    // 1. Check configuration
    console.log('📋 Configuration:');
    console.log('  Repository:', `${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}`);
    console.log('  Branch:', CMS_CONFIG.BRANCH);
    console.log('  Data file:', CMS_CONFIG.DATA_FILE_PATH);
    console.log('  Token configured:', !!CMS_CONFIG.GITHUB_TOKEN);
    console.log('  Passcode:', CMS_CONFIG.PASSCODE ? '****' : 'Not set');
    console.log('');
    
    // 2. Check if token is valid
    if (CMS_CONFIG.GITHUB_TOKEN) {
        console.log('🔐 Testing GitHub token...');
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${CMS_CONFIG.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                console.log('  ✅ Token valid!');
                console.log('  👤 Authenticated as:', user.login);
                console.log('  📧 Email:', user.email || 'Not public');
            } else {
                console.log('  ❌ Token invalid or expired');
                const error = await response.json();
                console.log('  Error:', error.message);
            }
        } catch (error) {
            console.log('  ❌ Error testing token:', error.message);
        }
        console.log('');
    } else {
        console.log('⚠️  No GitHub token configured\n');
    }
    
    // 3. Check if data.json exists in repository
    console.log('📄 Checking data.json in repository...');
    try {
        const response = await fetch(
            `https://api.github.com/repos/${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}/contents/${CMS_CONFIG.DATA_FILE_PATH}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (response.ok) {
            const file = await response.json();
            console.log('  ✅ data.json found in repository');
            console.log('  📦 Size:', file.size, 'bytes');
            console.log('  🔗 URL:', file.html_url);
        } else {
            console.log('  ❌ data.json not found in repository');
            console.log('  Status:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('  ❌ Error checking file:', error.message);
    }
    console.log('');
    
    // 4. Check repository access
    console.log('🏢 Checking repository access...');
    try {
        const response = await fetch(
            `https://api.github.com/repos/${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (response.ok) {
            const repo = await response.json();
            console.log('  ✅ Repository accessible');
            console.log('  📛 Name:', repo.full_name);
            console.log('  🔒 Private:', repo.private);
            console.log('  ⭐ Stars:', repo.stargazers_count);
            console.log('  🍴 Forks:', repo.forks_count);
        } else {
            console.log('  ❌ Repository not accessible');
            console.log('  Status:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('  ❌ Error checking repository:', error.message);
    }
    console.log('');
    
    // 5. Test portfolio data loading
    console.log('📊 Testing portfolio data...');
    if (portfolioData) {
        console.log('  ✅ Portfolio data loaded');
        console.log('  📜 Certifications:', portfolioData.certifications?.length || 0);
        console.log('  🚀 Data Science Projects:', portfolioData.projects?.dataScience?.length || 0);
        console.log('  🤖 AI Business Projects:', portfolioData.projects?.aiBusiness?.length || 0);
    } else {
        console.log('  ❌ Portfolio data not loaded');
    }
    console.log('');
    
    // 6. Summary
    console.log('📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const checks = [];
    checks.push(CMS_CONFIG.GITHUB_TOKEN ? '✅ Token configured' : '❌ Token missing');
    checks.push('✅ Repository: ' + `${CMS_CONFIG.REPO_OWNER}/${CMS_CONFIG.REPO_NAME}`);
    checks.push(portfolioData ? '✅ Data loaded' : '❌ Data not loaded');
    
    checks.forEach(check => console.log(check));
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Tips:');
    console.log('  • To activate admin: Click the dot (•) in the footer');
    console.log('  • To exit admin: CMS.exitAdminMode()');
    console.log('  • To view data: CMS.portfolioData()');
    console.log('  • To clear token: CMS.clearToken()');
    console.log('\n✨ CMS is ready to use!\n');
}

// Auto-run on load
console.log('🔧 CMS Debug script loaded. Run testCMSSetup() to test setup.');
