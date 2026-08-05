/**
 * Loke Nath Comb Factory - Google Authentication Helper Module
 * Utilizes Google Identity Services API (GSI)
 * Strictly enforces Google Authentication for Name & Email auto-fill.
 */

(function () {
  // Helper to decode JWT Payload from Google Credential response
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing Google Auth JWT Token:', e);
      return null;
    }
  }

  // Populate user data into forms & enforce read-only verified state
  function populateGoogleUserData(userData) {
    if (!userData) return;

    // Save to session storage
    sessionStorage.setItem('google_auth_user', JSON.stringify(userData));

    // Find contact forms on page
    const forms = document.querySelectorAll('form#contact-form, form[name="inquiry-form"]');
    
    forms.forEach(form => {
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      
      if (nameInput && userData.name) {
        nameInput.value = userData.name;
        nameInput.readOnly = true;
        nameInput.className = 'w-full px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50/50 text-gray-900 font-semibold cursor-not-allowed outline-none transition text-sm';
      }
      
      if (emailInput && userData.email) {
        emailInput.value = userData.email;
        emailInput.readOnly = true;
        emailInput.className = 'w-full px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50/50 text-gray-900 font-semibold cursor-not-allowed outline-none transition text-sm';
      }

      // Hide validation alert if active
      const alertBox = form.querySelector('#google-auth-required-alert');
      if (alertBox) alertBox.classList.add('hidden');

      // Add hidden input for Google Auth verification status
      let googleAuthInput = form.querySelector('input[name="google_verified_email"]');
      if (!googleAuthInput) {
        googleAuthInput = document.createElement('input');
        googleAuthInput.type = 'hidden';
        googleAuthInput.name = 'google_verified_email';
        form.appendChild(googleAuthInput);
      }
      googleAuthInput.value = `${userData.email} (Verified via Google Auth)`;

      // Render Verified Badge
      renderUserBadge(form, userData);
    });
  }

  // Clear user data and reset fields back to locked placeholder state
  function resetGoogleUserData(form) {
    sessionStorage.removeItem('google_auth_user');

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    
    if (nameInput) {
      nameInput.value = '';
      nameInput.readOnly = true;
      nameInput.placeholder = '🔒 Auto-filled via Google Sign-In';
      nameInput.className = 'w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100/80 text-gray-500 cursor-not-allowed outline-none transition text-sm';
    }

    if (emailInput) {
      emailInput.value = '';
      emailInput.readOnly = true;
      emailInput.placeholder = '🔒 Auto-filled via Google Sign-In';
      emailInput.className = 'w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100/80 text-gray-500 cursor-not-allowed outline-none transition text-sm';
    }

    const badgeContainer = form.querySelector('#google-auth-user-badge');
    const buttonContainer = form.querySelector('#google-auth-button-container');

    if (badgeContainer) {
      badgeContainer.classList.add('hidden');
      badgeContainer.classList.remove('flex');
    }
    if (buttonContainer) {
      buttonContainer.classList.remove('hidden');
    }
  }

  // Render User Profile Badge
  function renderUserBadge(form, userData) {
    const badgeContainer = form.querySelector('#google-auth-user-badge');
    const buttonContainer = form.querySelector('#google-auth-button-container');

    if (buttonContainer) {
      buttonContainer.classList.add('hidden');
    }

    if (badgeContainer) {
      badgeContainer.classList.remove('hidden');
      badgeContainer.classList.add('flex');
      badgeContainer.innerHTML = `
        <div class="w-full flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-xl gap-3">
          <img src="${userData.picture || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png'}" 
               alt="${userData.name}" 
               class="w-9 h-9 rounded-full border border-green-400 shadow-sm shrink-0">
          <div class="flex-1 text-xs min-w-0">
            <div class="font-bold text-gray-900 truncate flex items-center gap-1.5">
              <span>${userData.name}</span>
              <span class="inline-flex items-center gap-0.5 bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Google Verified
              </span>
            </div>
            <div class="text-gray-600 truncate">${userData.email}</div>
          </div>
          <button type="button" id="google-signout-btn" class="text-[11px] font-semibold text-brand-primary hover:text-red-600 underline shrink-0 cursor-pointer">
            Switch Account
          </button>
        </div>
      `;

      const signOutBtn = badgeContainer.querySelector('#google-signout-btn');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
          resetGoogleUserData(form);
        });
      }
    }
  }

  // Handle Google Credential Callback
  window.handleGoogleCallback = function (response) {
    if (!response || !response.credential) return;
    const userData = parseJwt(response.credential);
    if (userData) {
      console.log('Google Auth Success:', userData);
      populateGoogleUserData(userData);
    }
  };

  // Setup Form Submit Guard to ensure Google Auth is completed
  function setupFormValidation() {
    const forms = document.querySelectorAll('form#contact-form, form[name="inquiry-form"]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const savedUser = sessionStorage.getItem('google_auth_user');
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');

        if (!savedUser || !nameInput.value || !emailInput.value) {
          e.preventDefault();
          
          let alertBox = form.querySelector('#google-auth-required-alert');
          if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'google-auth-required-alert';
            alertBox.className = 'p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-2 mb-3 animate-bounce';
            alertBox.innerHTML = `
              <svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>Please click <strong>'Continue with Google'</strong> above to authenticate your Google ID before submitting!</span>
            `;
            const authBox = form.querySelector('#google-auth-button-container')?.parentElement;
            if (authBox) {
              authBox.after(alertBox);
            } else {
              form.prepend(alertBox);
            }
          } else {
            alertBox.classList.remove('hidden');
          }

          // Scroll to authentication box
          const authContainer = form.querySelector('#google-auth-button-container');
          if (authContainer) {
            authContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  // Initialize Google Identity SDK
  function initGoogleAuth() {
    const clientId = (typeof GOOGLE_AUTH_CONFIG !== 'undefined' && GOOGLE_AUTH_CONFIG.GOOGLE_CLIENT_ID)
      ? GOOGLE_AUTH_CONFIG.GOOGLE_CLIENT_ID
      : 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: window.handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const buttonContainers = document.querySelectorAll('#google-auth-button-container');
        buttonContainers.forEach(container => {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 280
          });
        });

        if (GOOGLE_AUTH_CONFIG.ENABLE_ONE_TAP && clientId !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
          window.google.accounts.id.prompt();
        }
      } catch (err) {
        console.warn('Google Auth Init Warning:', err);
      }
    }

    // Restore user from session if available
    const savedUser = sessionStorage.getItem('google_auth_user');
    if (savedUser) {
      try {
        populateGoogleUserData(JSON.parse(savedUser));
      } catch (e) {}
    }

    setupFormValidation();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleAuth();
      };
      document.head.appendChild(script);
    } else {
      initGoogleAuth();
    }
  });
})();
