// PERFORMANCE: Use strict mode for better optimization
"use strict";

document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  // ACCESSIBILITY & PERFORMANCE: Mobile Menu Toggle
  const toggleMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close Menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    });
  });

  // PERFORMANCE: Passive event listener for scroll to prevent jank
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // PERFORMANCE: Scroll Reveal using Intersection Observer for lightweight rendering
  const revealElements = document.querySelectorAll('.reveal');
  
  if (window.IntersectionObserver) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Trigger earlier
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ACCESSIBILITY & Form Validation
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');

  if (contactForm) {
    const inputs = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      message: document.getElementById('message')
    };

    const validateInput = (input, type) => {
      let isValid = true;
      const val = input.value.trim();

      if (type === 'name') {
        isValid = val.length > 0;
      } else if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = val.length > 0 && emailRegex.test(val);
      } else if (type === 'message') {
        isValid = val.length >= 20;
      }

      if (!isValid) {
        showError(input);
        // ACCESSIBILITY: Set aria-invalid for screen readers
        input.setAttribute('aria-invalid', 'true');
      } else {
        removeError(input);
        input.setAttribute('aria-invalid', 'false');
      }
      return isValid;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateInput(inputs.fullName, 'name');
      const isEmailValid = validateInput(inputs.email, 'email');
      const isMessageValid = validateInput(inputs.message, 'message');
      
      const isValid = isNameValid && isEmailValid && isMessageValid;
      
      if (isValid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.setAttribute('aria-busy', 'true');
        btn.disabled = true;
        
        // Simulate network request
        setTimeout(() => {
          contactForm.reset();
          btn.textContent = originalText;
          btn.removeAttribute('aria-busy');
          btn.disabled = false;
          
          successMessage.classList.add('show');
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMessage.classList.remove('show');
          }, 5000);
        }, 1500);
      } else {
        // Focus first invalid input for accessibility
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });

    // Helper functions
    const showError = (input) => {
      input.closest('.form-group').classList.add('error');
    };

    const removeError = (input) => {
      input.closest('.form-group').classList.remove('error');
    };
    
    // Real-time validation feedback (debounced for performance)
    let debounceTimer;
    Object.values(inputs).forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (input.closest('.form-group').classList.contains('error')) {
            if (input.id === 'fullName') validateInput(input, 'name');
            if (input.id === 'email') validateInput(input, 'email');
            if (input.id === 'message') validateInput(input, 'message');
          }
        }, 300);
      });
    });
  }
});
