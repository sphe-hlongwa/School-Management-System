document.addEventListener('DOMContentLoaded', () => {
    
    // Active nav link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active-link');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    if (navMenu) navMenu.classList.remove('active');
                }
            }
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            question.classList.toggle('active');
            if (answer) answer.classList.toggle('show');
        });
    });

    // Grade Tabs
    document.querySelectorAll('.grade-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.grade-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Gallery Filters
    document.querySelectorAll('.gallery-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('.gallery-filter').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
        });
    });

    // Form Validation (HTML5 Native)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.checkValidity()) {
                // Show notification instead of generic alert
                showNotification('Form submitted successfully! (Demo)', 'success');
                form.reset();
            } else {
                form.reportValidity();
            }
        });
    });

    // Sticky Navigation on Scroll (Throttled)
    const navbar = document.querySelector('.navbar');
    let isScrolling = false;

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 100) {
                        navbar.style.background = 'var(--navy)';
                        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    } else {
                        navbar.style.background = 'var(--navy)';
                        navbar.style.boxShadow = 'var(--shadow)';
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    // Notification System Refactored
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger reflow for transition
        void notification.offsetWidth;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300); // Wait for transition to end before removing
        }, 3000);
    }
});
