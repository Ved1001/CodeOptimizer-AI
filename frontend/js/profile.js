// Profile Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Render common page elements
    components.renderSidebar('profile');
    components.renderHeader('My Profile');
    
    // Set subtitle text
    const subtitleEl = document.getElementById('headerSubtitle');
    if (subtitleEl) {
        subtitleEl.innerText = "Manage your account settings, update your personal info, or change your password.";
    }

    const editProfileForm = document.getElementById('editProfileForm');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // ── Load Profile Data ──
    async function loadProfile() {
        try {
            // GET /auth/profile retrieves details of authenticated user
            const profile = await api.get(CONFIG.AUTH_API, '/auth/profile');
            
            // Populate profile display card details
            document.getElementById('profName').innerText = profile.name;
            document.getElementById('profEmail').innerText = profile.email;
            
            const roleBadge = document.getElementById('profRoleBadge');
            if (roleBadge) {
                roleBadge.className = `badge badge-${profile.role === 'ADMIN' ? 'danger' : 'primary'}`;
                roleBadge.innerText = profile.role;
            }

            const memberSinceEl = document.getElementById('profMemberSince');
            if (memberSinceEl) {
                const dateStr = components.formatDate(profile.createdAt);
                memberSinceEl.innerText = dateStr.split(',')[0]; // Just date portion
            }

            // Initials avatar
            const initials = profile.name
                ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                : 'U';
            document.getElementById('profAvatar').innerText = initials;

            // Pre-fill edit profile form input
            document.getElementById('name').value = profile.name;

        } catch (error) {
            console.error('Error loading profile details:', error);
            components.showToast('Failed to load profile details.', 'error');
        } finally {
            components.hideSkeleton();
        }
    }

    // ── Edit Profile submit handler ──
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const nameInput = document.getElementById('name');
            const submitBtn = editProfileForm.querySelector('button[type="submit"]');
            const name = nameInput.value.trim();

            if (!name) {
                showFieldError(nameInput, 'Name is required');
                return;
            }

            components.showLoading(submitBtn);

            try {
                // PUT /auth/profile {name}
                const updatedProfile = await api.put(CONFIG.AUTH_API, '/auth/profile', { name });
                
                // Update local storage user data
                const user = api.getUser();
                if (user) {
                    user.name = updatedProfile.name;
                    api.setUser(user);
                }

                components.showToast('Profile updated successfully!', 'success');
                
                // Reload displays (header, sidebar initials, card info)
                loadProfile();
                components.renderSidebar('profile');
            } catch (error) {
                console.error('Error updating profile:', error);
                components.showToast(error.message || 'Failed to update profile.', 'error');
            } finally {
                components.hideLoading(submitBtn, 'Save Changes');
            }
        });
    }

    // ── Request OTP Code handler ──
    const requestOtpBtn = document.getElementById('requestOtpBtn');
    if (requestOtpBtn) {
        requestOtpBtn.addEventListener('click', async () => {
            components.showLoading(requestOtpBtn);
            try {
                await api.post(CONFIG.AUTH_API, '/auth/send-verification-code', {});
                components.showToast('Verification code sent to your email!', 'success');
                
                // Disable button for 60 seconds as a cooldown
                let cooldown = 60;
                requestOtpBtn.disabled = true;
                const originalText = requestOtpBtn.innerText;
                requestOtpBtn.innerText = `Resend in ${cooldown}s`;
                const interval = setInterval(() => {
                    cooldown--;
                    if (cooldown <= 0) {
                        clearInterval(interval);
                        requestOtpBtn.disabled = false;
                        requestOtpBtn.innerText = originalText;
                    } else {
                        requestOtpBtn.innerText = `Resend in ${cooldown}s`;
                    }
                }, 1000);
            } catch (error) {
                console.error('Error requesting OTP:', error);
                components.showToast(error.message || 'Failed to request OTP.', 'error');
            } finally {
                components.hideLoading(requestOtpBtn, 'Request OTP Code');
            }
        });
    }

    // ── Change Password submit handler ──
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const verificationCodeInput = document.getElementById('verificationCode');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
            const submitBtn = changePasswordForm.querySelector('button[type="submit"]');

            const verificationCode = verificationCodeInput ? verificationCodeInput.value.trim() : '';
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            // Validations
            let hasError = false;
            if (!verificationCode) {
                if (verificationCodeInput) showFieldError(verificationCodeInput, 'Verification code is required');
                hasError = true;
            }

            if (!newPassword) {
                showFieldError(newPasswordInput, 'New password is required');
                hasError = true;
            } else if (newPassword.length < 6) {
                showFieldError(newPasswordInput, 'New password must be at least 6 characters long');
                hasError = true;
            }

            if (!confirmNewPassword) {
                showFieldError(confirmNewPasswordInput, 'Please confirm your new password');
                hasError = true;
            } else if (newPassword !== confirmNewPassword) {
                showFieldError(confirmNewPasswordInput, 'New passwords do not match');
                hasError = true;
            }

            if (hasError) return;

            components.showLoading(submitBtn);

            try {
                // PUT /auth/change-password {verificationCode, newPassword, confirmNewPassword}
                await api.put(CONFIG.AUTH_API, '/auth/change-password', { 
                    verificationCode, 
                    newPassword, 
                    confirmNewPassword 
                });
                components.showToast('Password updated successfully!', 'success');
                changePasswordForm.reset();
            } catch (error) {
                console.error('Error changing password:', error);
                components.showToast(error.message || 'Failed to change password. Make sure verification code is correct.', 'error');
                if (verificationCodeInput) showFieldError(verificationCodeInput, error.message || 'Incorrect verification code');
            } finally {
                components.hideLoading(submitBtn, 'Change Password');
            }
        });
    }

    // Form validation helpers
    function showFieldError(inputEl, message) {
        inputEl.classList.add('error');
        const wrapper = inputEl.closest('.form-group') || inputEl.parentElement;
        
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
    }

    // Initial load
    loadProfile();
});
