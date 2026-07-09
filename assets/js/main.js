document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navPanel = document.querySelector('.nav-panel');
    
    if (navToggle && navPanel) {
        navPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    // 2. Active Link Highlighting based on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-panel a');

    function highlightNav() {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', () => {
        highlightNav();
        const header = document.querySelector('.site-header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 3. Smooth Advanced Animations (Replacing Impeccable)
    // We use IntersectionObserver with a spring-like CSS transition
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add base styles to elements we want to animate
    const animateElements = document.querySelectorAll('.section-heading, .skill-card, .project-card, .timeline-item, .blog-grid article, .service-grid article');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index % 3 * 0.1}s`;
        observer.observe(el);
    });

    // 4. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.project-card, .skill-card, .about-copy, .profile-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; // let CSS coverflow handle the reset
            card.style.transition = 'transform 0.5s ease';
            card.style.zIndex = '1';
        });
    });

    // 5. Contact Form Submission Handling
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    btn.textContent = 'Message Sent!';
                    btn.style.backgroundColor = '#00d722';
                    this.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            }).catch(error => {
                // Fallback for formsubmit.co which sometimes redirects instead of json response
                this.submit(); 
            });
        });
    }
});

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows exactly
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Ring follows with easing (lerp)
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, label, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    
    // --- Trailing Cursor Animation ---
    // Create follower element dynamically
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15; // lerp factor
        followerY += (mouseY - followerY) * 0.15;
        
        // Update position (transform handles the centering and rotation)
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Add hover states to interactives
    const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-tag, .contact-item');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
