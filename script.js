// Gururaja Engineers - Parboil Machinery Website
// Main JavaScript file for interactivity and functionality

// DOMContentLoaded event to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initSmoothScroll();
    initContactForm();
    initCurrentYear();
    initScrollAnimation();
});

// Mobile Navigation Toggle
function initNavbar() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Update active link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Validation and Submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    // Form validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    
    // Clear all error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    // Validate individual field
    function validateField(fieldId, errorId, validationFn, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(errorId);
        const value = field.value.trim();
        
        if (validationFn(value)) {
            errorElement.textContent = '';
            field.style.borderColor = '#ddd';
            return true;
        } else {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Validation functions
    function validateRequired(value) {
        return value !== '';
    }
    
    function validateEmail(value) {
        return emailPattern.test(value);
    }
    
    function validatePhone(value) {
        if (value === '') return true; // Phone is optional
        return phonePattern.test(value);
    }
    
    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        // Name validation
        if (!validateField('name', 'nameError', validateRequired, 'Name is required')) {
            isValid = false;
        }
        
        // Email validation
        if (!validateField('email', 'emailError', validateRequired, 'Email is required')) {
            isValid = false;
        } else if (!validateField('email', 'emailError', validateEmail, 'Please enter a valid email address')) {
            isValid = false;
        }
        
        // Phone validation (optional)
        if (!validateField('phone', 'phoneError', validatePhone, 'Please enter a valid phone number')) {
            isValid = false;
        }
        
        // Subject validation
        if (!validateField('subject', 'subjectError', validateRequired, 'Subject is required')) {
            isValid = false;
        }
        
        // Message validation
        if (!validateField('message', 'messageError', validateRequired, 'Message is required')) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        if (validateForm()) {
            // In a real application, this would send data to a server
            // For demo purposes, we'll simulate form submission
            
            // Show success message
            formSuccess.style.display = 'block';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                formSuccess.style.display = 'none';
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 3000);
            
            // Log form data to console (for demo)
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            console.log('Form submitted with data:', formData);
        }
    });
    
    // Real-time validation on input
    const formFields = ['name', 'email', 'phone', 'subject', 'message'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                switch(fieldId) {
                    case 'name':
                        validateField('name', 'nameError', validateRequired, 'Name is required');
                        break;
                    case 'email':
                        if (field.value.trim() !== '') {
                            validateField('email', 'emailError', validateEmail, 'Please enter a valid email address');
                        }
                        break;
                    case 'phone':
                        if (field.value.trim() !== '') {
                            validateField('phone', 'phoneError', validatePhone, 'Please enter a valid phone number');
                        }
                        break;
                    case 'subject':
                        validateField('subject', 'subjectError', validateRequired, 'Subject is required');
                        break;
                    case 'message':
                        validateField('message', 'messageError', validateRequired, 'Message is required');
                        break;
                }
            });
        }
    });
}

// Update copyright year automatically
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Add scroll animation to elements
function initScrollAnimation() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .stat-item');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Add animation class to elements in viewport
    function checkScroll() {
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
}

// Newsletter subscription (demo functionality)
document.addEventListener('DOMContentLoaded', function() {
    const newsletterBtn = document.querySelector('.newsletter button');
    const newsletterInput = document.querySelector('.newsletter input');
    
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterInput.value.trim();
            
            if (email === '') {
                alert('Please enter your email address');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate subscription
            newsletterInput.value = '';
            alert('Thank you for subscribing to our newsletter!');
        });
        
        // Allow Enter key to submit
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });
    }
});