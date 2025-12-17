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
    
    // WhatsApp number - CORRECTED: 91 (India code) + 6304962115 (10 digits)
    const whatsappNumber = '916304962115'; // Fixed: Added the missing '5'
    
    // Form validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
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
        // Remove all non-digit characters
        const cleanValue = value.replace(/\D/g, '');
        // Check if it's exactly 10 digits
        return cleanValue.length === 10;
    }
    
    // Format phone number for display
    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }
        return phone;
    }
    
    // Format WhatsApp message
    function formatWhatsAppMessage(formData) {
        return `*New Inquiry from Gururaja Engineers Website*%0A%0A👤 *Name:* ${formData.name}%0A📞 *Phone:* ${formData.phone}%0A📧 *Email:* ${formData.email}%0A📋 *Subject:* ${formData.subject}%0A💬 *Message:* ${formData.message}%0A%0A_This inquiry was sent via website contact form_`;
    }
    
    // Create WhatsApp URL with proper encoding
    function createWhatsAppUrl(formData) {
        const message = formatWhatsAppMessage(formData);
        
        // Use this format which works for both web and mobile
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
        
        // Phone validation - updated error message
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
    
    // WhatsApp button click handler - SIMPLIFIED VERSION
    whatsappBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearErrors();
        
        if (validateForm()) {
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: formatPhoneNumber(document.getElementById('phone').value.trim()),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Create WhatsApp URL
            const message = formatWhatsAppMessage(formData);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            // Show loading state
            const originalText = whatsappBtn.innerHTML;
            whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
            whatsappBtn.disabled = true;
            
            // Open WhatsApp
            setTimeout(() => {
                // Always open in new tab
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                
                // Show success message
                formSuccess.innerHTML = `
                    <div style="display: flex; align-items: flex-start;">
                        <i class="fab fa-whatsapp" style="color: #25D366; font-size: 1.5rem; margin-right: 10px;"></i>
                        <div>
                            <strong>WhatsApp is opening...</strong>
                            <p style="margin: 5px 0 0 0; font-size: 0.9rem;">
                                Your message is ready to send! Check the new tab/window.
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 0.85rem; color: #666;">
                                <small>If WhatsApp didn't open, please allow pop-ups for this site.</small>
                            </p>
                        </div>
                    </div>
                `;
                formSuccess.style.display = 'block';
                formSuccess.style.backgroundColor = '#25D366';
                formSuccess.style.color = 'white';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    whatsappBtn.innerHTML = originalText;
                    whatsappBtn.disabled = false;
                }, 2000);
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    formSuccess.style.display = 'none';
                }, 5000);
                
                // Log for debugging
                console.log('WhatsApp URL:', whatsappUrl);
                console.log('Form data:', formData);
                
            }, 300);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Real-time validation
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
    
    // Allow Enter key in textarea but not in other fields
    contactForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !e.target.type === 'textarea') {
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
