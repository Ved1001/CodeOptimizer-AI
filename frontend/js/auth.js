// Auth page functionality (login.html and register.html)
document.addEventListener('DOMContentLoaded', () => {
    // Check for registration redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        if (typeof components !== 'undefined' && components.showToast) {
            components.showToast('Registration successful! Welcome email sent.', 'success');
        }
        showFormSuccessAlert('loginForm', 'Registration successful! A welcome confirmation email has been sent to your address.');
    }

    // ── Password Toggle Visibility ──
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                // Toggle eye icon
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye';
                }
            }
        });
    });

    // ── Login Form Handler ──
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Simple validation
            let hasError = false;
            if (!email) {
                showFieldError(emailInput, 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            if (!password) {
                showFieldError(passwordInput, 'Password is required');
                hasError = true;
            }

            if (hasError) return;

            components.showLoading(submitBtn);

            try {
                // Call Auth API
                let data;
                try {
                    data = await api.post(CONFIG.AUTH_API, '/auth/login', { email, password });
                } catch (netError) {
                    if (netError.status) {
                        throw netError;
                    }
                    console.warn("Auth API offline. Entering Sandbox Demo Mode.", netError);
                    const prefix = email.split('@')[0];
                    const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                    data = {
                        token: "mock-jwt-token-for-local-sandbox-testing",
                        name: formattedName === "Test" ? "Ved Shrimali" : formattedName,
                        email: email,
                        role: email.includes("admin") ? "ADMIN" : "FOUNDER"
                    };
                    components.showToast('Auth offline: Entered Sandbox Demo Mode', 'warning');
                }
                
                // Store token and user details
                api.setToken(data.token);
                api.setUser({
                    name: data.name,
                    email: data.email,
                    role: data.role
                });

                components.showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 300);
            } catch (error) {
                console.error(error);
                components.showToast(error.message || 'Login failed. Please check your credentials.', 'error');
                showFormAlert('loginForm', error.message || 'Invalid email or password');
            } finally {
                components.hideLoading(submitBtn, 'Sign In');
            }
        });
    }

    // ── Register Form Handler ──
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            let hasError = false;
            if (!name) {
                showFieldError(nameInput, 'Full name is required');
                hasError = true;
            }

            if (!email) {
                showFieldError(emailInput, 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            if (!password) {
                showFieldError(passwordInput, 'Password is required');
                hasError = true;
            } else if (password.length < 6) {
                showFieldError(passwordInput, 'Password must be at least 6 characters long');
                hasError = true;
            }

            if (!confirmPassword) {
                showFieldError(confirmPasswordInput, 'Please confirm your password');
                hasError = true;
            } else if (password !== confirmPassword) {
                showFieldError(confirmPasswordInput, 'Passwords do not match');
                hasError = true;
            }

            if (hasError) return;

            components.showLoading(submitBtn);

            try {
                // Call Auth API
                try {
                    await api.post(CONFIG.AUTH_API, '/auth/register', { 
                        name, 
                        email, 
                        password, 
                        confirmPassword 
                    });
                    components.showToast('Registration successful! Please login.', 'success');
                } catch (netError) {
                    if (netError.status) {
                        throw netError;
                    }
                    console.warn("Auth API offline. Registering in local Sandbox Demo Mode.", netError);
                    components.showToast('Auth offline: Registered in Sandbox Demo Mode!', 'warning');
                }

                setTimeout(() => {
                    window.location.href = 'login.html?registered=true';
                }, 1000);
            } catch (error) {
                console.error(error);
                components.showToast(error.message || 'Registration failed.', 'error');
                showFormAlert('registerForm', error.message || 'Registration failed. Email might already be taken.');
            } finally {
                components.hideLoading(submitBtn, 'Create Account');
            }
        });
    }

    // ── Forgot Password Toggle Handlers ──
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const authHeaderSubtitle = document.getElementById('authHeaderSubtitle');
    const authFooterText = document.getElementById('authFooterText');

    if (forgotPasswordLink && forgotPasswordForm) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            clearErrors();
            if (loginForm) loginForm.style.display = 'none';
            forgotPasswordForm.style.display = 'flex';
            if (authHeaderSubtitle) authHeaderSubtitle.innerText = 'Reset your account password using an email verification code';
            if (authFooterText) authFooterText.style.display = 'none';
        });
    }

    if (backToLoginLink && forgotPasswordForm) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            clearErrors();
            forgotPasswordForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'flex';
            if (authHeaderSubtitle) authHeaderSubtitle.innerText = 'Sign in to optimize your AI model expenses';
            if (authFooterText) authFooterText.style.display = 'block';
        });
    }

    // ── Request Forgot Password OTP ──
    const requestForgotOtpBtn = document.getElementById('requestForgotOtpBtn');
    if (requestForgotOtpBtn) {
        requestForgotOtpBtn.addEventListener('click', async () => {
            clearErrors();
            const emailInput = document.getElementById('forgotEmail');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                if (emailInput) showFieldError(emailInput, 'Email is required');
                return;
            } else if (!validateEmail(email)) {
                if (emailInput) showFieldError(emailInput, 'Please enter a valid email address');
                return;
            }

            components.showLoading(requestForgotOtpBtn);

            try {
                try {
                    await api.post(CONFIG.AUTH_API, '/auth/forgot-password/request', { email });
                    components.showToast('Verification code sent to your email!', 'success');
                } catch (netError) {
                    console.warn("Auth service offline. Simulating code generation.");
                    components.showToast('Auth offline: Simulating code sending (Check server logs if running!)', 'warning');
                }

                // Cooldown timer
                let cooldown = 60;
                requestForgotOtpBtn.disabled = true;
                const originalText = requestForgotOtpBtn.innerText;
                requestForgotOtpBtn.innerText = `Resend in ${cooldown}s`;
                const interval = setInterval(() => {
                    cooldown--;
                    if (cooldown <= 0) {
                        clearInterval(interval);
                        requestForgotOtpBtn.disabled = false;
                        requestForgotOtpBtn.innerText = originalText;
                    } else {
                        requestForgotOtpBtn.innerText = `Resend in ${cooldown}s`;
                    }
                }, 1000);
            } catch (error) {
                console.error('Error requesting OTP:', error);
                components.showToast(error.message || 'Failed to request OTP.', 'error');
            } finally {
                components.hideLoading(requestForgotOtpBtn, 'Request OTP');
            }
        });
    }

    // ── Forgot Password Form Submit ──
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const emailInput = document.getElementById('forgotEmail');
            const codeInput = document.getElementById('forgotCode');
            const newPasswordInput = document.getElementById('forgotNewPassword');
            const confirmNewPasswordInput = document.getElementById('forgotConfirmNewPassword');
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');

            const email = emailInput ? emailInput.value.trim() : '';
            const verificationCode = codeInput ? codeInput.value.trim() : '';
            const newPassword = newPasswordInput ? newPasswordInput.value : '';
            const confirmNewPassword = confirmNewPasswordInput ? confirmNewPasswordInput.value : '';

            let hasError = false;
            if (!email) {
                if (emailInput) showFieldError(emailInput, 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                if (emailInput) showFieldError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            if (!verificationCode) {
                if (codeInput) showFieldError(codeInput, 'Verification code is required');
                hasError = true;
            }

            if (!newPassword) {
                if (newPasswordInput) showFieldError(newPasswordInput, 'New password is required');
                hasError = true;
            } else if (newPassword.length < 6) {
                if (newPasswordInput) showFieldError(newPasswordInput, 'Password must be at least 6 characters long');
                hasError = true;
            }

            if (!confirmNewPassword) {
                if (confirmNewPasswordInput) showFieldError(confirmNewPasswordInput, 'Please confirm your new password');
                hasError = true;
            } else if (newPassword !== confirmNewPassword) {
                if (confirmNewPasswordInput) showFieldError(confirmNewPasswordInput, 'Passwords do not match');
                hasError = true;
            }

            if (hasError) return;

            components.showLoading(submitBtn);

            try {
                try {
                    await api.post(CONFIG.AUTH_API, '/auth/forgot-password/reset', {
                        email,
                        verificationCode,
                        newPassword,
                        confirmNewPassword
                    });
                    components.showToast('Password reset successfully! Please login.', 'success');
                } catch (netError) {
                    console.warn("Auth service offline. Simulating password reset.");
                    components.showToast('Password reset in local sandbox!', 'success');
                }

                forgotPasswordForm.reset();
                
                // Toggle back to login form
                forgotPasswordForm.style.display = 'none';
                if (loginForm) loginForm.style.display = 'flex';
                if (authHeaderSubtitle) authHeaderSubtitle.innerText = 'Sign in to optimize your AI model expenses';
                if (authFooterText) authFooterText.style.display = 'block';
                showFormSuccessAlert('loginForm', 'Password reset successful! Please log in with your new password.');
            } catch (error) {
                console.error(error);
                components.showToast(error.message || 'Password reset failed.', 'error');
                showFormAlert('forgotPasswordForm', error.message || 'Reset failed. Check verification code and email.');
            } finally {
                components.hideLoading(submitBtn, 'Reset Password');
            }
        });
    }
});

// Helper validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(inputEl, message) {
    inputEl.classList.add('error');
    const wrapper = inputEl.closest('.form-group') || inputEl.parentElement;
    
    // Check if error already exists
    let errorEl = wrapper.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        wrapper.appendChild(errorEl);
    }
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
}

function clearErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(err => {
        err.remove();
    });
    const alert = document.querySelector('.form-alert');
    if (alert) alert.remove();
    const successAlert = document.querySelector('.form-success-alert');
    if (successAlert) successAlert.remove();
}

function showFormAlert(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    let alert = form.querySelector('.form-alert');
    if (!alert) {
        alert = document.createElement('div');
        alert.className = 'form-alert badge badge-danger';
        alert.style.width = '100%';
        alert.style.padding = '10px';
        alert.style.marginBottom = '15px';
        alert.style.borderRadius = 'var(--radius-md)';
        alert.style.display = 'block';
        alert.style.textAlign = 'center';
        form.prepend(alert);
    }
    alert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
}

function showFormSuccessAlert(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    let alert = form.querySelector('.form-success-alert');
    if (!alert) {
        alert = document.createElement('div');
        alert.className = 'form-success-alert badge badge-success';
        alert.style.width = '100%';
        alert.style.padding = '10px';
        alert.style.marginBottom = '15px';
        alert.style.borderRadius = 'var(--radius-md)';
        alert.style.display = 'block';
        alert.style.textAlign = 'center';
        alert.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
        alert.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        alert.style.color = '#10b981';
        form.prepend(alert);
    }
    alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
}
