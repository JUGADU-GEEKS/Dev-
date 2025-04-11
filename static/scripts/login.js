document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const signInBtn = document.getElementById('signInBtn');
    const emailField = document.getElementById('email');
    
    // Password visibility toggle
    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Toggle the eye icon
        if (type === 'password') {
            togglePassword.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        } else {
            togglePassword.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
        }
    });
    
    // Input field focus effects
    const inputFields = document.querySelectorAll('.input-field input');
    inputFields.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#6a762a';
            this.parentElement.style.boxShadow = '0 0 0 4px rgba(106, 118, 42, 0.15)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '#e0e3d8';
            this.parentElement.style.boxShadow = 'none';
        });
    });
    
    // Form validation with enhanced feedback
    signInBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = emailField.value;
        const password = passwordField.value;
        let isValid = true;
        
        // Reset previous error states
        emailField.parentElement.style.borderColor = '#e0e3d8';
        passwordField.parentElement.style.borderColor = '#e0e3d8';
        
        if (!email) {
            emailField.parentElement.style.borderColor = '#d9534f';
            emailField.placeholder = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailField.parentElement.style.borderColor = '#d9534f';
            emailField.value = '';
            emailField.placeholder = 'Please enter a valid email';
            isValid = false;
        }
        
        if (!password) {
            passwordField.parentElement.style.borderColor = '#d9534f';
            passwordField.placeholder = 'Password is required';
            isValid = false;
        }
        
        if (isValid) {
            signInBtn.innerHTML = '<span>Signing in...</span>';
            signInBtn.disabled = true;
            
            // Make API call to backend
            fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .then(data => {
                // Create success notification
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#6a762a';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '4px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.textContent = `Welcome back, ${data.user.firstName}!`;
                
                document.body.appendChild(notification);
                
                // Store user data in localStorage if remember me is checked
                if (document.getElementById('remember').checked) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Remove notification after 2 seconds and redirect
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                        // Redirect to home page
                        window.location.href = '/home';
                    }, 500);
                }, 2000);
            })
            .catch(error => {
                // Show error notification
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#d9534f';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '4px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.textContent = error.error || 'Login failed';
                
                document.body.appendChild(notification);
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 3000);
            })
            .finally(() => {
                signInBtn.innerHTML = 'Sign In';
                signInBtn.disabled = false;
            });
        }
    });
    
    // Email validation
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Animated dots for banner slideshow
    let currentDot = 0;
    const dots = document.querySelectorAll('.dot');
    
    setInterval(() => {
        dots[currentDot].classList.remove('active');
        currentDot = (currentDot + 1) % dots.length;
        dots[currentDot].classList.add('active');
    }, 3000);
});