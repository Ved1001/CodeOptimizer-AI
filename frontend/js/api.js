const api = {
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    setToken(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
    },

    getUser() {
        const userStr = localStorage.getItem(CONFIG.USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            this.removeUser();
            return null;
        }
    },

    setUser(userData) {
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(userData));
    },

    removeUser() {
        localStorage.removeItem(CONFIG.USER_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    logout() {
        this.removeToken();
        this.removeUser();
        // Redirect to login
        const currentPath = window.location.pathname;
        if (!currentPath.endsWith('login.html') && !currentPath.endsWith('register.html')) {
            window.location.href = 'login.html';
        }
    },

    async request(baseUrl, path, method = 'GET', body = null) {
        const url = `${baseUrl}${path}`;
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method,
            headers
        };
        
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Global 401 handler
                this.logout();
                const err = new Error('Unauthorized access - redirecting to login.');
                err.status = 401;
                throw err;
            }
            
            if (!response.ok) {
                let errMsg = `Request failed with status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errMsg = errorData.message || errMsg;
                } catch (e) {
                    // response is not JSON
                }
                const err = new Error(errMsg);
                err.status = response.status;
                throw err;
            }
            
            // Check if there is content to return
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error(`API Error on ${method} ${url}:`, error);
            throw error;
        }
    },

    async get(baseUrl, path) {
        return this.request(baseUrl, path, 'GET');
    },

    async post(baseUrl, path, body) {
        return this.request(baseUrl, path, 'POST', body);
    },

    async put(baseUrl, path, body) {
        return this.request(baseUrl, path, 'PUT', body);
    },

    async del(baseUrl, path) {
        return this.request(baseUrl, path, 'DELETE');
    }
};
