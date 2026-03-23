// Public frontend configuration only.
// Do not place private API keys in this file.

const CONFIG = {
    // Serverless endpoint that proxies chat requests to OpenRouter
    CHAT_API_ENDPOINT: '/api/chat',
    
    // Development mode flag
    DEVELOPMENT: true,
    
    // Feature flags
    FEATURES: {
        CHAT_WIDGET: true,
        ANALYTICS: false
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
