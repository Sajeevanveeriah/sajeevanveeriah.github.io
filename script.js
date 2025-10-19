/* ===================================
   Particle Animation Background
   =================================== */
class ParticleAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
            this.ctx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

/* ===================================
   Navigation
   =================================== */
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.navLinksContainer = document.getElementById('navLinks');
        this.sections = document.querySelectorAll('.section, .hero');
        
        this.init();
    }
    
    init() {
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    this.navLinksContainer.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            });
        });
        
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => {
            this.navLinksContainer.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');
        });
        
        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Initial check
        this.handleScroll();
    }
    
    handleScroll() {
        // Navbar background on scroll
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Active section highlighting
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

/* ===================================
   Scroll to Top Button
   =================================== */
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ===================================
   Contact Form Handler
   =================================== */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.formStatus = document.getElementById('formStatus');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Create mailto link with form data
            const mailtoLink = `mailto:sajeevanveeriah@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            )}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            this.showStatus('Thank you for your message! Your email client should open shortly.', 'success');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            this.showStatus('There was an error. Please email directly at sajeevanveeriah@gmail.com', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    showStatus(message, type) {
        this.formStatus.textContent = message;
        this.formStatus.className = `form-status ${type}`;
        
        setTimeout(() => {
            this.formStatus.className = 'form-status';
        }, 5000);
    }
}

/* ===================================
   Intersection Observer for Animations
   =================================== */
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.skill-category, .project-card, .timeline-item, .about-highlights, .contact-item'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }
}

/* ===================================
   Typing Effect for Hero Section
   =================================== */
class TypingEffect {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

/* ===================================
   Skill Tags Interactive Hover
   =================================== */
class SkillInteraction {
    constructor() {
        this.init();
    }
    
    init() {
        const skillTags = document.querySelectorAll('.skill-tag, .tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateY(-2px)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
}

/* ===================================
   Interactive Skill Filter
   =================================== */
class SkillFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.skillCategories = document.querySelectorAll('.skill-category');
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter categories
                this.filterCategories(filter);
            });
        });
    }
    
    filterCategories(filter) {
        this.skillCategories.forEach(category => {
            if (filter === 'all') {
                category.classList.remove('hidden');
                category.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                const categories = category.getAttribute('data-category');
                if (categories && categories.includes(filter)) {
                    category.classList.remove('hidden');
                    category.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    category.classList.add('hidden');
                }
            }
        });
    }
}

/* ===================================
   Project Card Interactions
   =================================== */
class ProjectInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

/* ===================================
   Timeline Animation
   =================================== */
class TimelineAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }
}

/* ===================================
   Lazy Loading Images
   =================================== */
class LazyImageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/* ===================================
   Page Performance Monitor
   =================================== */
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
            
            // Add loaded class to body for CSS animations
            document.body.classList.add('loaded');
        });
    }
}

/* ===================================
   Initialize All Components
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle animation
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleAnimation(canvas);
    }
    
    // Initialize navigation
    new Navigation();
    
    // Initialize scroll to top button
    new ScrollToTop();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Initialize typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = [
            'Mechatronics Engineer',
            'Embedded Systems Developer',
            'Robotics Engineer',
            'IoT Solutions Architect',
            'Automation Specialist'
        ];
        new TypingEffect(typingElement, texts);
    }
    
    // Initialize skill interactions
    new SkillInteraction();
    
    // Initialize skill filter
    new SkillFilter();
    
    // Initialize project interactions
    new ProjectInteractions();
    
    // Initialize timeline animation
    new TimelineAnimation();
    
    // Initialize lazy loading
    new LazyImageLoader();
    
    // Initialize performance monitor
    new PerformanceMonitor();
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

/* ===================================
   Console Welcome Message
   =================================== */
console.log('%c👋 Welcome to Sajeevan Veeriah\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the GitHub repository!', 'color: #94a3b8; font-size: 14px;');
console.log('%chttps://github.com/Sajeevanveeriah', 'color: #00d4ff; font-size: 14px;');
