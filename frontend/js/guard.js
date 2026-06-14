// Route Guard — Simple redirect-only for protected pages
// Public pages (dashboard, terminal) handle their own init via DOMContentLoaded
(function() {
    const isAuth = api.isAuthenticated();
    const path = window.location.pathname;
    const isPublicPage = path.endsWith('dashboard.html') || path.endsWith('terminal.html') || path.endsWith('/') || path.endsWith('index.html');

    if (!isAuth && !isPublicPage) {
        // Protected page + not logged in → redirect
        document.documentElement.style.visibility = 'hidden';
        window.location.replace('login.html');
        return;
    }

    // Make page visible immediately
    document.documentElement.style.visibility = 'visible';

    // For authenticated users on any page: run background token validation
    if (isAuth) {
        const token = api.getToken();
        if (token !== "mock-jwt-token-for-local-sandbox-testing") {
            api.get(CONFIG.AUTH_API, '/auth/validate').catch(err => {
                console.warn('Background auth validation failed:', err);
            });
        }
    }
})();

// Helper to get current user data
function getCurrentUser() {
    return api.getUser();
}
