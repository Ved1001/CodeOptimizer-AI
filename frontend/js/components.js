// Reusable Components & UI Helper functions
const components = {
    hideSkeleton() {
        const skeleton = document.getElementById('page-skeleton');
        const content = document.getElementById('main-content-wrapper');
        if (skeleton) {
            skeleton.style.display = 'none';
        }
        if (content) {
            content.style.opacity = '1';
        }
    },
    renderSidebar(activePage) {
        const sidebarEl = document.getElementById('sidebar');
        if (!sidebarEl) return;

        const isAuthenticated = api.isAuthenticated();
        const user = isAuthenticated 
            ? (api.getUser() || { name: 'User', email: 'user@example.com', role: 'USER' }) 
            : { name: 'Guest User', email: 'Please sign in', role: 'GUEST' };
        
        // Helper to generate initials for avatar
        const initials = user.name
            ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2)
            : 'G';

        sidebarEl.className = 'sidebar';
        
        const footerBtnHtml = isAuthenticated
            ? `<button class="sidebar-logout" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
               </button>`
            : `<button class="sidebar-logout" id="loginBtn" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border: none; font-weight: 600;">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
               </button>`;

        sidebarEl.innerHTML = `
            <div class="sidebar-logo">
                <img src="images/favicon.svg" alt="CostReducer AI" class="sidebar-logo-img" style="width: 28px; height: 28px; object-fit: contain; margin-right: var(--space-2);">
                <div class="sidebar-logo-text">CostReducer AI</div>
            </div>
            <div class="sidebar-nav">
                <a href="dashboard.html" class="sidebar-link ${activePage === 'dashboard' ? 'active' : ''}">
                    <i class="fas fa-eye"></i>
                    <span>Overview & Concept</span>
                </a>
                <a href="terminal.html" class="sidebar-link ${activePage === 'terminal' ? 'active' : ''}">
                    <i class="fas fa-terminal"></i>
                    <span>Code Terminal</span>
                </a>
                
                <div class="sidebar-section-label">Security & Account</div>
                <a href="profile.html" class="sidebar-link ${activePage === 'profile' ? 'active' : ''}">
                    <i class="fas fa-user-gear"></i>
                    <span>Account Settings</span>
                </a>
            </div>
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="avatar sm">${initials}</div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">${user.name}</div>
                        <div class="sidebar-user-email">${user.email}</div>
                    </div>
                </div>
                ${footerBtnHtml}
            </div>
        `;

        // Add event listener for logout or login
        if (isAuthenticated) {
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                api.logout();
            });
        } else {
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }
        }

        // Inject Sidebar Toggle Button if not exists
        if (!document.querySelector('.sidebar-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'sidebar-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(toggleBtn);

            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            toggleBtn.addEventListener('click', () => this.toggleSidebar());
            overlay.addEventListener('click', () => this.toggleSidebar());
        }
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.toggle('sidebar-open');
            overlay.classList.toggle('active');
        }
    },

    renderHeader(title) {
        const headerContainer = document.getElementById('page-header');
        if (!headerContainer) return;

        headerContainer.className = 'page-header';
        headerContainer.innerHTML = `
            <div class="page-header-left">
                <h1 class="page-title">${title}</h1>
                <div class="page-subtitle" id="headerSubtitle">Intelligent FinOps middleware routing panel</div>
            </div>
            <div class="page-header-actions" id="headerActions">
                <button class="btn btn-ghost btn-sm" id="themeToggleBtn" title="Toggle Light/Dark Theme" style="border-radius: var(--radius-full); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; padding: 0; border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer;">
                    <i class="fas fa-sun" id="themeToggleIcon" style="font-size: 16px; color: var(--text-primary);"></i>
                </button>
            </div>
        `;

        const btn = document.getElementById('themeToggleBtn');
        const icon = document.getElementById('themeToggleIcon');

        // Apply theme based on current state (localStorage)
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'light') {
            document.documentElement.classList.add('light-theme');
            if (icon) icon.className = 'fas fa-moon';
        } else {
            document.documentElement.classList.remove('light-theme');
            if (icon) icon.className = 'fas fa-sun';
        }

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isLight = document.documentElement.classList.toggle('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                if (icon) {
                    icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
                }
            });
        }
    },

    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        if (type === 'warning') iconClass = 'fa-exclamation-triangle';

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="toast-body">${message}</div>
            <div class="toast-close">
                <i class="fas fa-times"></i>
            </div>
        `;

        container.appendChild(toast);

        const closeToast = () => {
            if (toast.classList.contains('removing')) return;
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        };

        toast.querySelector('.toast-close').addEventListener('click', closeToast);

        // Auto remove after 4 seconds
        setTimeout(closeToast, 4000);
    },

    showLoading(buttonEl) {
        if (!buttonEl) return;
        buttonEl.disabled = true;
        buttonEl.dataset.originalText = buttonEl.innerHTML;
        buttonEl.innerHTML = `<span class="loading-spinner"></span>`;
    },

    hideLoading(buttonEl, originalText = null) {
        if (!buttonEl) return;
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalText || buttonEl.dataset.originalText || 'Submit';
    },

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDistance(km) {
        if (km === undefined || km === null) return '0.0 km';
        return `${Number(km).toFixed(1)} km`;
    },

    formatTime(minutes) {
        if (!minutes) return '0m';
        const hrs = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        }
        return `${mins}m`;
    }
};
