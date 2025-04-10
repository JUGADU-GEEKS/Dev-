document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  // Current year for copyright
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Enhanced animate on scroll implementation with more sophisticated animations
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Check if element is in viewport with improved calculation
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // Show elements earlier for smoother entrance
    const threshold = 0.75;
    return (
      rect.top <= windowHeight * threshold &&
      rect.bottom >= 0
    );
  };
  
  // Add animations with staggered delay based on position
  const handleScroll = () => {
    animatedElements.forEach((element, index) => {
      if (isInViewport(element)) {
        // Add general animation class
        element.classList.add('aos-animate');
        
        // Get animation type
        const animationType = element.getAttribute('data-aos');
        element.classList.add(animationType);
        
        // Apply custom or specified delay
        const delay = element.getAttribute('data-aos-delay') || (index % 3) * 100;
        element.style.transitionDelay = `${delay}ms`;
        
        // Apply custom duration if specified
        const duration = element.getAttribute('data-aos-duration') || 800;
        element.style.transitionDuration = `${duration}ms`;
      }
    });
  };
  
  // Initial check on load with slight delay for smoother first appearance
  setTimeout(handleScroll, 100);
  
  // Improved scroll handler with debounce for performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(handleScroll);
  });
  
  // Enhanced header scroll effect with smoother transitions
  const header = document.querySelector('.header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Enhanced smooth scrolling for anchor links with easing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Smoother scroll with easing
        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        window.requestAnimationFrame(step);
        
        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          
          window.scrollTo(0, startPosition + distance * easeInOutQuad(Math.min(progress / duration, 1)));
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        // Close mobile menu if open
        if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          nav.classList.remove('active');
        }
      }
    });
  });
  
  // Add hover effect for problem cards
  const problemCards = document.querySelectorAll('.problem-card');
  problemCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover-effect');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover-effect');
    });
  });
  
  // Add animation to hero section elements
  const heroElements = document.querySelectorAll('.hero .title, .hero .subtitle, .hero .buttons');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('visible');
    }, index * 300);
  });
  
  // Add pulse animation to CTA buttons
  const ctaButtons = document.querySelectorAll('.cta .btn');
  if (ctaButtons.length) {
    setInterval(() => {
      ctaButtons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
          button.classList.remove('pulse');
        }, 1000);
      }, 5000);
    });
  }
});