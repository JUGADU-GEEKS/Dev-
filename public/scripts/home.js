// Generate cloud elements
function generateClouds() {
    const cloudCount = 6;
    const cloudsContainer = document.getElementById('clouds');
    
    for (let i = 0; i < cloudCount; i++) {
      // Randomize cloud properties
      const size = 50 + Math.random() * 150;
      const top = Math.random() * 100;
      const opacity = 0.4 + Math.random() * 0.3;
      
      // Determine animation class
      let animationClass = '';
      if (i % 3 === 0) {
        animationClass = 'float-slow';
      } else if (i % 3 === 1) {
        animationClass = 'float-medium';
      } else {
        animationClass = 'float-fast';
      }
      
      // Create cloud element
      const cloud = document.createElement('div');
      cloud.className = `cloud ${animationClass}`;
      cloud.style.top = `${top}px`;
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size / 2}px`;
      cloud.style.opacity = opacity;
      cloud.style.animationDelay = `${Math.random() * 40}s`;
      
      cloudsContainer.appendChild(cloud);
    }
  }
  
  // Initialize everything when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Generate cloud animation
    generateClouds();
    
    // Add event listeners for buttons
    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Button clicked:', this.querySelector('span').textContent);
      });
    });
  });