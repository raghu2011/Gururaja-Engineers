// Gururaja Engineers - Parboil Machinery Website
// Main JavaScript file for interactivity and functionality

// DOMContentLoaded event to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initSmoothScroll();
    initWhatsAppForm(); // Changed from initContactForm()
    initCurrentYear();
    initScrollAnimation();
    initNewsletter();
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

// WhatsApp Form Validation and Submission (Replaces initContactForm)
function initWhatsAppForm() {
    const whatsappBtn = document.getElementById('whatsappSubmit');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (!whatsappBtn || !contactForm) return;
    
    // Form validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    
    // Clear all error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Reset border colors
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.style.borderColor = '#ddd';
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
        const cleanValue = value.replace(/\D/g, '');
        return phonePattern.test(cleanValue);
    }
    
    // Format WhatsApp message
    function formatWhatsAppMessage(formData) {
        return `*New Inquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}%0A%0A_This inquiry was sent via your website contact form_`;
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
        
        // Phone validation
        if (!validateField('phone', 'phoneError', validateRequired, 'Phone number is required')) {
            isValid = false;
        } else if (!validateField('phone', 'phoneError', validatePhone, 'Please enter a valid 10-digit phone number')) {
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
    
    // WhatsApp button click handler
    whatsappBtn.addEventListener('click', function() {
        clearErrors();
        
        if (validateForm()) {
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim().replace(/\D/g, ''),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // WhatsApp number
            const whatsappNumber = '916304962115';
            
            // Create WhatsApp message
            const whatsappMessage = formatWhatsAppMessage(formData);
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            formSuccess.textContent = 'Opening WhatsApp with your message... Please send it to contact us!';
            formSuccess.style.display = 'block';
            formSuccess.style.backgroundColor = '#25D366';
            
            // Optional: Reset form after successful submission
            setTimeout(() => {
                contactForm.reset();
                formSuccess.style.display = 'none';
            }, 5000);
            
            // Log form data to console (for demo)
            console.log('WhatsApp form data:', {
                ...formData,
                whatsappUrl: whatsappUrl,
                timestamp: new Date().toISOString()
            });
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
                        } else {
                            validateField('email', 'emailError', validateRequired, 'Email is required');
                        }
                        break;
                    case 'phone':
                        if (field.value.trim() !== '') {
                            validateField('phone', 'phoneError', validatePhone, 'Please enter a valid 10-digit phone number');
                        } else {
                            validateField('phone', 'phoneError', validateRequired, 'Phone number is required');
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
            
            // Clear error on input
            field.addEventListener('input', function() {
                const errorElement = document.getElementById(fieldId + 'Error');
                if (errorElement && errorElement.textContent) {
                    errorElement.textContent = '';
                    field.style.borderColor = '#ddd';
                }
            });
        }
    });
    
    // Allow form submission with Enter key (but it will trigger WhatsApp)
    contactForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.target.tagName === 'TEXTAREA') {
            e.preventDefault();
            whatsappBtn.click();
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
function initNewsletter() {
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
}