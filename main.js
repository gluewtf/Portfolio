/* ============================================
   PORTFOLIO — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initParticles();
    initNavbar();
    initTypewriter();
    initScrollAnimations();
    initSkillBars();
    initCountUp();
    initProjectFilters();
    initContactForm();
    initSmoothScroll();
    initCodeWindowTilt();
});

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */

function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePos = { x: -1000, y: -1000 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 20));
    const CONNECTION_DISTANCE = 120;
    const MOUSE_RADIUS = 180;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.3 + 0.1;
            this.alpha = this.baseAlpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse interaction — gentle push
            const dx = this.x - mousePos.x;
            const dy = this.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx += (dx / dist) * force * 0.02;
                this.vy += (dy / dist) * force * 0.02;
                this.alpha = this.baseAlpha + force * 0.3;
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVBAR
   ============================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
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

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        'Full Stack Developer',
        'MySQL Specialist',
        'React Specialist',
        'Problem Solver',
        'Creative Coder'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after small delay
    setTimeout(type, 1000);
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */

function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep it simple
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   SKILL BARS ANIMATION
   ============================================ */

function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    fills.forEach(fill => observer.observe(fill));
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */

function initCountUp() {
    const numbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    numbers.forEach(num => observer.observe(num));
}

function animateNumber(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   PROJECT FILTERS
   ============================================ */

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.style.animation = `slide-up 0.5s ease ${index * 0.08}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        // Update hidden subject with user's subject if provided
        const subjectInput = document.getElementById('formSubject');
        const hiddenSubject = document.getElementById('formHiddenSubject');
        if (subjectInput && subjectInput.value && hiddenSubject) {
            hiddenSubject.value = subjectInput.value;
        }

        // Show loading state
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Success
                btn.innerHTML = '<span>✓ Sent successfully!</span>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                form.reset();
            } else {
                // API returned error
                btn.innerHTML = '<span>✗ Error sending</span>';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                console.error('Web3Forms error:', result.message);
            }
        } catch (error) {
            // Network error
            btn.innerHTML = '<span>✗ Connection error</span>';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            console.error('Fetch error:', error);
        }

        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
        }, 3000);
    });

    // Floating label animation fix
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   CODE WINDOW TILT EFFECT
   ============================================ */

function initCodeWindowTilt() {
    const codeWindow = document.querySelector('.code-window');
    if (!codeWindow || window.matchMedia('(max-width: 768px)').matches) return;

    codeWindow.addEventListener('mousemove', (e) => {
        const rect = codeWindow.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        codeWindow.style.animation = 'none';
    });

    codeWindow.addEventListener('mouseleave', () => {
        codeWindow.style.transform = '';
        codeWindow.style.animation = 'float 6s ease-in-out infinite';
    });
}
