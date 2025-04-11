document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const signUpBtn = document.getElementById('signUpBtn');
    const termsAgree = document.getElementById('termsAgree');
    
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
            if (!this.value) {
                this.parentElement.style.borderColor = '#e0e3d8';
                this.parentElement.style.boxShadow = 'none';
            }
        });
    });
    
    // Form validation
    signUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;
        const password = passwordField.value;
        let isValid = true;
        
        // Reset all error states
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.input-field').forEach(field => {
            field.style.borderColor = '#e0e3d8';
        });
        
        // Validate first name
        if (!firstName) {
            document.getElementById('firstNameError').style.display = 'block';
            document.getElementById('firstName').parentElement.style.borderColor = '#d9534f';
            isValid = false;
        }
        
        // Validate city
        if (!city) {
            document.getElementById('cityError').style.display = 'block';
            document.getElementById('city').parentElement.style.borderColor = '#d9534f';
            isValid = false;
        }
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('email').parentElement.style.borderColor = '#d9534f';
            isValid = false;
        }
        
        // Validate password
        if (!password || password.length < 8) {
            document.getElementById('passwordError').style.display = 'block';
            passwordField.parentElement.style.borderColor = '#d9534f';
            isValid = false;
        }
        
        // Validate terms agreement
        if (!termsAgree.checked) {
            termsAgree.nextElementSibling.style.color = '#d9534f';
            isValid = false;
        } else {
            termsAgree.nextElementSibling.style.color = '#82896d';
        }
        
        if (isValid) {
            // Show loading state
            signUpBtn.innerHTML = '<span>Creating account...</span>';
            signUpBtn.disabled = true;
            
            // Make API call to backend
            fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    city: city,
                    email: email,
                    password: password,
                    newsletter: document.getElementById('newsletter').checked
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
                notification.style.borderRadius = '8px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.style.fontWeight = '500';
                notification.textContent = 'Account created successfully! Welcome to Agro Nexus.';
                
                document.body.appendChild(notification);
                
                // Remove notification after 3 seconds and redirect
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                        // Redirect to home page after successful signup
                        window.location.href = '/home';
                    }, 500);
                }, 3000);
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
                notification.style.borderRadius = '8px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.style.fontWeight = '500';
                notification.textContent = error.error || 'Failed to create account';
                
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
                // Reset button state
                signUpBtn.innerHTML = 'Create Account';
                signUpBtn.disabled = false;
            });
        }
    });
    
    // Email validation function
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
    
    // Terms checkbox effect
    termsAgree.addEventListener('change', function() {
        if (this.checked) {
            this.nextElementSibling.style.color = '#82896d';
        }
    });
});