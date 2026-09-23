// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ==================== ENHANCED BACKGROUND ANIMATIONS ====================

// Matrix Rain Effect (Performance-optimized with RAF & IntersectionObserver)
function initMatrixRain() {
    if (window.innerWidth <= 768) return;
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    let isVisible = true;
    const heroSection = document.getElementById('home');
    if ('IntersectionObserver' in window && heroSection) {
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        observer.observe(heroSection);
    }

    let lastDraw = 0;
    function drawMatrix(timestamp) {
        if (!isVisible || document.hidden) {
            requestAnimationFrame(drawMatrix);
            return;
        }
        if (timestamp - lastDraw > 42) {
            lastDraw = timestamp;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0bd9f4';
            ctx.font = fontSize + 'px arial';

            for(let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        requestAnimationFrame(drawMatrix);
    }

    requestAnimationFrame(drawMatrix);
}

// Particle System (Performance-optimized with RAF & IntersectionObserver)
function initParticleSystem() {
    if (window.innerWidth <= 768) return;
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 35; // Streamlined particle count for high FPS

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(11, 217, 244, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let isVisible = true;
    const heroSection = document.getElementById('home');
    if ('IntersectionObserver' in window && heroSection) {
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        observer.observe(heroSection);
    }

    function animateParticles() {
        if (!isVisible || document.hidden) {
            requestAnimationFrame(animateParticles);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 90) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(11, 217, 244, ${0.18 - distance / 500})`;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
}

// Dynamic Connection Lines
function initConnectionLines() {
    const svg = document.querySelector('.connection-svg');
    if (!svg) return;
    
    const group = svg.querySelector('.connection-group');
    const points = [
        { x: '10%', y: '20%' },
        { x: '30%', y: '40%' },
        { x: '60%', y: '30%' },
        { x: '80%', y: '60%' },
        { x: '20%', y: '80%' },
        { x: '70%', y: '80%' }
    ];

    function createLine(p1, p2, delay = 0) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1.x);
        line.setAttribute('y1', p1.y);
        line.setAttribute('x2', p2.x);
        line.setAttribute('y2', p2.y);
        line.setAttribute('class', 'connection-line');
        line.style.animationDelay = delay + 's';
        group.appendChild(line);
    }

    // Create random connections
    for (let i = 0; i < points.length - 1; i++) {
        setTimeout(() => {
            createLine(points[i], points[i + 1], i * 0.5);
        }, i * 500);
    }
}

// Scroll-based Animation Control (Reflow-free with cached layout)
function initScrollAnimations() {
    if (window.innerWidth <= 768) return;

    let ticking = false;
    let cachedDocHeight = document.documentElement.scrollHeight || 4000;
    let cachedViewportHeight = window.innerHeight || 800;

    window.addEventListener('resize', () => {
        cachedDocHeight = document.documentElement.scrollHeight || 4000;
        cachedViewportHeight = window.innerHeight || 800;
    }, { passive: true });

    const techParticles = document.querySelectorAll('.tech-particle');
    const shapes = document.querySelectorAll('.shape');
    const bubbles = document.querySelectorAll('.bubble');

    function updateAnimations() {
        const scrollY = window.pageYOffset || window.scrollY;
        const maxScroll = Math.max(1, cachedDocHeight - cachedViewportHeight);
        const scrollPercent = Math.min(1, Math.max(0, scrollY / maxScroll));

        // Update tech particles based on scroll
        if (techParticles.length > 0) {
            techParticles.forEach((particle, index) => {
                const delay = index * 0.1;
                const rotation = scrollPercent * 360 + delay * 50;
                const translateY = Math.sin(scrollPercent * Math.PI * 2 + delay) * 20;
                particle.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
            });
        }

        // Update geometric shapes
        if (shapes.length > 0) {
            shapes.forEach((shape, index) => {
                const scale = 0.8 + Math.sin(scrollPercent * Math.PI * 4 + index) * 0.3;
                const rotation = scrollPercent * 180 + index * 45;
                shape.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            });
        }

        // Update bubble opacity based on scroll
        if (bubbles.length > 0) {
            bubbles.forEach((bubble, index) => {
                const opacity = 0.1 + Math.sin(scrollPercent * Math.PI * 2 + index * 0.5) * 0.3;
                bubble.style.opacity = Math.max(0.1, opacity);
            });
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// Responsive Canvas Resize
function handleResize() {
    const matrixCanvas = document.getElementById('matrixCanvas');
    const particleCanvas = document.getElementById('particleCanvas');
    
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
    
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
}

// Initialize all background animations
function initBackgroundAnimations() {
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
        initMatrixRain();
        initParticleSystem();
        initConnectionLines();
        initScrollAnimations();
        initMouseInteraction();
        initSectionAnimations();
    }, 100);
}

// ==================== SECTION-SPECIFIC ANIMATIONS ====================

// Initialize section-specific animations
function initSectionAnimations() {
    initAboutBinaryRain();
    initProjectsCodeBlocks();
    initSkillsNeuralNetwork();
    initCertificatesSparkles();
}

// About Section - Binary Rain
function initAboutBinaryRain() {
    const binaryRain = document.querySelector('.about-binary-rain');
    if (!binaryRain) return;

    const binaryChars = ['0', '1', '01', '10', '101', '010', '110', '001'];
    const columnCount = Math.floor(window.innerWidth / 30);

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.left = (i * 30) + 'px';
        column.style.animationDelay = (Math.random() * 8) + 's';
        
        // Generate binary string
        let binaryString = '';
        for (let j = 0; j < 20; j++) {
            binaryString += binaryChars[Math.floor(Math.random() * binaryChars.length)] + '\n';
        }
        column.textContent = binaryString;
        
        binaryRain.appendChild(column);
    }
}

// Projects Section - Floating Code Blocks
function initProjectsCodeBlocks() {
    const codeBlocksContainers = document.querySelectorAll('.floating-code-blocks');
    
    const codeSnippets = [
        'def analyze_data():\n  return insights',
        'SELECT * FROM users\nWHERE active = true',
        'import pandas as pd\ndf.groupby("category")',
        'const api = async () => {\n  await fetch("/data")\n}',
        'from sklearn import models\nclf.fit(X_train, y_train)',
        'CREATE DASHBOARD\nFROM raw_data',
        'if __name__ == "__main__":\n  main()',
        'npm install react\nnpm start'
    ];

    codeBlocksContainers.forEach(container => {
        setInterval(() => {
            if (container.children.length < 3) {
                const codeBlock = document.createElement('div');
                codeBlock.className = 'code-block';
                codeBlock.style.left = Math.random() * 90 + '%';
                codeBlock.style.animationDelay = '0s';
                codeBlock.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                
                container.appendChild(codeBlock);
                
                setTimeout(() => {
                    if (codeBlock.parentNode) {
                        codeBlock.remove();
                    }
                }, 20000);
            }
        }, 3000);
    });
}

// Skills Section - Neural Network
function initSkillsNeuralNetwork() {
    const neuralNetwork = document.querySelector('.neural-network');
    if (!neuralNetwork) return;

    // Create neural nodes
    const nodePositions = [
        { x: 20, y: 30 }, { x: 20, y: 70 },
        { x: 40, y: 20 }, { x: 40, y: 50 }, { x: 40, y: 80 },
        { x: 60, y: 25 }, { x: 60, y: 55 }, { x: 60, y: 75 },
        { x: 80, y: 35 }, { x: 80, y: 65 }
    ];

    nodePositions.forEach((pos, index) => {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.left = pos.x + '%';
        node.style.top = pos.y + '%';
        node.style.animationDelay = (index * 0.2) + 's';
        neuralNetwork.appendChild(node);
    });

    // Create connections
    const connections = [
        [0, 2], [0, 3], [1, 3], [1, 4],
        [2, 5], [3, 6], [4, 7],
        [5, 8], [6, 8], [7, 9]
    ];

    connections.forEach((conn, index) => {
        const startNode = nodePositions[conn[0]];
        const endNode = nodePositions[conn[1]];
        
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        
        const deltaX = endNode.x - startNode.x;
        const deltaY = endNode.y - startNode.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        connection.style.left = startNode.x + '%';
        connection.style.top = startNode.y + '%';
        connection.style.width = distance * (window.innerWidth / 100) + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.transformOrigin = '0 50%';
        connection.style.animationDelay = (index * 0.3) + 's';
        
        neuralNetwork.appendChild(connection);
    });
}

// Certificates Section - Achievement Sparkles
function initCertificatesSparkles() {
    const sparklesContainer = document.querySelector('.achievement-sparkles');
    if (!sparklesContainer) return;

    const sparkleSymbols = ['★', '✦', '✧', '✨', '⭐', '🌟', '💫', '✪'];

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = Math.random() > 0.5 ? 'sparkle star-sparkle' : 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 4 + 's';
        sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
        
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 4000);
    }

    // Create initial sparkles
    for (let i = 0; i < 15; i++) {
        setTimeout(createSparkle, i * 300);
    }

    // Continuously create new sparkles
    setInterval(createSparkle, 800);
}

// Enhanced mobile detection and responsiveness
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Mobile-specific adjustments
function initMobileOptimizations() {
    if (isMobileDevice()) {

        // Reduce animation intensity on mobile
        const techParticles = document.querySelectorAll('.tech-particle');
        techParticles.forEach(particle => {
            particle.style.animationDuration = '30s'; // Slower on mobile
        });

        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.style.animationDuration = '12s'; // Slower on mobile
        });

        // Disable mouse trail on mobile
        document.removeEventListener('mousemove', createMouseTrail);
    }
}

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const typewriter = document.getElementById('typewriter');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
        // Initialize background animations after loading
        initBackgroundAnimations();
        initMobileOptimizations();
    }, 1500);
});

// Window resize handler
window.addEventListener('resize', () => {
    handleResize();
    initMobileOptimizations();
});

// Orientation change handler for mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        handleResize();
        initMobileOptimizations();
    }, 100);
});

// Mouse interaction effects (Throttled & Reflow-free)
function initMouseInteraction() {
    if (window.innerWidth <= 768 || ('ontouchstart' in window)) return;

    let ticking = false;
    let lastTrailTime = 0;

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const now = Date.now();

        // Throttle trail creation to once every 80ms
        if (now - lastTrailTime > 80) {
            lastTrailTime = now;
            createMouseTrail(mouseX, mouseY);
        }

        if (!ticking) {
            requestAnimationFrame(() => {
                const normX = (mouseX / window.innerWidth - 0.5) * 12;
                const normY = (mouseY / window.innerHeight - 0.5) * 12;
                const container = document.querySelector('.floating-tech-icons');
                if (container) {
                    container.style.transform = `translate(${normX}px, ${normY}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Mouse trail effect (Throttled pool)
function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 600);
}

// Add CSS for mouse trail
const mouseTrailCSS = `
.mouse-trail {
    position: fixed;
    width: 6px;
    height: 6px;
    background: radial-gradient(circle, rgba(11, 217, 244, 0.8), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: trailFade 0.8s ease-out forwards;
}

@keyframes trailFade {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}
`;

// Inject mouse trail CSS
const mouseTrailStyle = document.createElement('style');
mouseTrailStyle.textContent = mouseTrailCSS;
document.head.appendChild(mouseTrailStyle);

// Typewriter Effect
const typewriterTexts = [
    "Data Science Student & AI Tools Builder",
    "ML Model Training & Predictive Modeling",
    "Power BI & Advanced Excel Dashboards",
    "Developing Intelligent Web Tools using AI",
    "Solving Business Problems with AI & Automation",
    "Deepgram Speech AI & Call Analytics"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterSpeed = 100;

function typewriterEffect() {
    const currentText = typewriterTexts[textIndex];
    
    if (isDeleting) {
        typewriter.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typewriterSpeed = 50;
    } else {
        typewriter.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typewriterSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        typewriterSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        typewriterSpeed = 500;
    }
    
    setTimeout(typewriterEffect, typewriterSpeed);
}

// Start typewriter effect
typewriterEffect();

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('show');
    }
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'visible';
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Theme Toggle
let isDarkTheme = true;

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    
    // Add rotation effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// Back to Top Button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Skills Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const languageBars = document.querySelectorAll('.language-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
    languageBars.forEach(bar => observer.observe(bar));
}

// Animate soft skills on hover
function animateSoftSkills() {
    const softSkillItems = document.querySelectorAll('.soft-skill-item');
    
    softSkillItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        item.addEventListener('animationend', () => {
            const icon = item.querySelector('i');
            icon.style.animation = '';
        });
        
        // Staggered animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.5 });
        
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        
        observer.observe(item);
    });
}

// Animate language items
function animateLanguages() {
    const languageItems = document.querySelectorAll('.language-item');
    
    languageItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        
                        // Animate the progress bar
                        const progressBar = item.querySelector('.language-progress');
                        const width = progressBar.getAttribute('data-width');
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 300);
                    }, index * 200);
                }
            });
        }, { threshold: 0.5 });
        
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.8s ease';
        
        observer.observe(item);
    });
}

// Tech icons enhanced animation
function enhanceTechIcons() {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach((icon, index) => {
        // Floating animation
        setInterval(() => {
            const randomY = (Math.random() - 0.5) * 10;
            icon.style.transform = `translateY(${randomY}px)`;
        }, 3000 + index * 200);
        
        // Enhanced hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.animation = 'techIconPulse 0.6s ease-in-out';
        });
        
        icon.addEventListener('animationend', () => {
            icon.style.animation = '';
        });
    });
}

// Add new animations to CSS dynamically
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes techIconPulse {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.15) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    
    @keyframes skillCategorySlide {
        0% { 
            opacity: 0; 
            transform: translateY(50px);
        }
        100% { 
            opacity: 1; 
            transform: translateY(0);
        }
    }
    
    .skill-category {
        animation: skillCategorySlide 0.8s ease-out;
    }
    
    .skill-category:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .skill-category:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .tool-tag {
        transition: all 0.3s ease;
    }
    
    .tool-tag:hover {
        background: var(--gradient);
        color: white;
        transform: scale(1.05);
    }
`;
document.head.appendChild(enhancedStyle);

// Initialize skill bars animation
animateSkillBars();

// Initialize new skill animations
animateSoftSkills();
animateLanguages();
enhanceTechIcons();

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:seelamvamsisivaganesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    contactForm.reset();
});

// Show Success Message
function showSuccessMessage() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Floating Animation for Hero Icons
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 500);
    });
}

// Initialize floating icons
initFloatingIcons();

// Intersection Observer for Animation Triggers
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.timeline-item, .project-card, .certificate-card').forEach(el => {
    observer.observe(el);
});

// Project Card Hover Effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Certificate Card Flip Effect
document.querySelectorAll('.certificate-card').forEach(card => {
    let isFlipped = false;
    
    card.addEventListener('click', () => {
        isFlipped = !isFlipped;
        const front = card.querySelector('.certificate-front');
        const back = card.querySelector('.certificate-back');
        
        if (isFlipped) {
            front.style.transform = 'rotateY(180deg)';
            back.style.transform = 'rotateY(0deg)';
        } else {
            front.style.transform = 'rotateY(0deg)';
            back.style.transform = 'rotateY(180deg)';
        }
    });
});

// Social Links Hover Effect
document.querySelectorAll('.social-link, .social-btn').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.animation = 'pulse 0.6s ease-in-out';
    });
    
    link.addEventListener('animationend', () => {
        link.style.animation = '';
    });
});

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Navbar Active Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add active nav link styles
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--text-primary) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navStyle);

// Form Input Animation
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Check if input has value on page load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Cursor Trail Effect (Optional Enhancement)
function createCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--gradient);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: opacity 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            if (nextDot) {
                x += (parseFloat(nextDot.style.left) - x) * 0.3;
                y += (parseFloat(nextDot.style.top) - y) * 0.3;
            }
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
    createCursorTrail();
}

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Download Resume Function
function downloadResume() {
    // Open Google Drive folder in new tab
    window.open('https://drive.google.com/drive/folders/1djNDuc4KvK4gYK4_vsnCnGWwcACEXUlq', '_blank');
}

// Add click event to resume button
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadResume();
    });
}

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Error Handling for Images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        console.warn(`Failed to load image: ${img.src}`);
    });
});

// Performance Optimization: Debounce Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Console Welcome Message
console.log(`
%c🚀 Welcome to Vamsi's Portfolio!
%c
Built with ❤️ using:
• HTML5 & CSS3
• Vanilla JavaScript
• AOS Animation Library
• Modern Web APIs

Feel free to explore the code!
GitHub: https://github.com/Svamsi2006
`, 
'color: #2979ff; font-size: 16px; font-weight: bold;',
'color: #00e676; font-size: 12px;'
);

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics Event Tracking (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log(`Event: ${eventName}`, properties);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    const element = e.target.closest('a, button');
    if (element) {
        const action = element.textContent.trim();
        const href = element.href;
        trackEvent('click', { action, href });
    }
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        alert('🎉 Konami Code Activated! You found the easter egg!');
        konamiCode = [];
    }
});

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll(
        '.hero-content, .hero-image, .section-title, .about-text, .about-animation'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Cleanup function for memory management
window.addEventListener('beforeunload', () => {
    // Clean up any intervals or observers
    observer.disconnect();
    
    // Remove event listeners if needed
    // This helps prevent memory leaks
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        typewriterEffect,
        animateSkillBars,
        showSuccessMessage,
        downloadResume,
        trackEvent
    };
}

// AI Chat Widget Functionality
class ChatWidget {
    constructor() {
        // Route AI requests through a serverless endpoint to keep API keys private
        this.apiEndpoint = (typeof CONFIG !== 'undefined' && CONFIG && CONFIG.CHAT_API_ENDPOINT)
            ? CONFIG.CHAT_API_ENDPOINT
            : '/api/chat';
        this.isOpen = false;
        this.isTyping = false;
        this.apiAvailable = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupPortfolioContext();
        this.checkChatService();
        
        // Show initial notification
        setTimeout(() => {
            this.showNotification();
        }, 3000);
    }
    
    initializeElements() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatTyping = document.getElementById('chatTyping');
        this.chatNotification = document.getElementById('chatNotification');
        this.suggestionBtns = document.querySelectorAll('.suggestion-btn');
        this.chatStatusText = document.querySelector('.chat-status span');
        
        // Debug: Check if all elements are found
        const elements = {
            chatToggle: this.chatToggle,
            chatContainer: this.chatContainer,
            chatClose: this.chatClose,
            chatMessages: this.chatMessages,
            chatInput: this.chatInput,
            chatSend: this.chatSend,
            chatTyping: this.chatTyping,
            chatNotification: this.chatNotification,
            chatStatusText: this.chatStatusText,
            suggestionBtns: this.suggestionBtns.length
        };
        
        console.log('Chat widget elements:', elements);
        
        // Check for missing elements
        Object.entries(elements).forEach(([key, element]) => {
            if (!element || (key === 'suggestionBtns' && element === 0)) {
                console.error(`❌ Missing chat element: ${key}`);
            }
        });
    }
    
    setupEventListeners() {
        // Add error handling for missing elements
        if (!this.chatToggle || !this.chatContainer || !this.chatClose || !this.chatInput || !this.chatSend) {
            console.error('❌ Cannot setup chat listeners: Missing required elements');
            return;
        }
        
        console.log('✅ Setting up chat event listeners...');
        
        this.chatToggle.addEventListener('click', () => {
            console.log('Chat toggle clicked');
            this.toggleChat();
        });
        
        this.chatClose.addEventListener('click', () => {
            console.log('Chat close clicked');
            this.closeChat();
        });
        
        this.chatSend.addEventListener('click', () => {
            console.log('Chat send clicked');
            this.sendMessage();
        });
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in chat input');
                this.sendMessage();
            }
        });
        
        this.suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.getAttribute('data-suggestion');
                console.log('Suggestion clicked:', suggestion);
                this.chatInput.value = suggestion;
                this.sendMessage();
            });
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatToggle.contains(e.target) && !this.chatContainer.contains(e.target)) {
                this.closeChat();
            }
        });
        
        console.log('✅ Chat event listeners setup complete');
    }

    async checkChatService() {
        if (!this.chatStatusText) return;

        // Opening index.html directly from file system cannot reach serverless routes.
        if (window.location.protocol === 'file:') {
            this.chatStatusText.textContent = 'Needs server';
            this.chatStatusText.title = 'Run with Vercel dev or deploy to Vercel to use /api/chat';
            console.warn('Chat disabled: Running from file:// protocol');
            return;
        }

        try {
            console.log('🔍 Checking chat service health at:', this.apiEndpoint);
            
            // Use abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                this.apiAvailable = true;
                this.chatStatusText.textContent = '✅ Online';
                this.chatStatusText.title = 'Chat service is ready';
                console.log('✅ Chat service is online');
                return;
            }

            console.warn(`⚠️ Chat API returned ${response.status}`);
            this.chatStatusText.textContent = 'Server issue';
            this.chatStatusText.title = `Chat API health check failed with ${response.status}`;
        } catch (error) {
            console.warn('⚠️ Chat health check failed:', error.message);
            // Don't fully disable - allow fallback responses and user can still try
            this.chatStatusText.textContent = '⏳ Checking...';
            this.chatStatusText.title = 'Service check in progress. Try sending a message to test.';
            
            // Retry health check after delay
            setTimeout(() => this.checkChatService(), 8000);
        }
    }
    
    setupPortfolioContext() {
        this.portfolioData = {
            name: "Vamsi Seelam",
            role: "Data Science Student & AI Tools Developer",
            headline: "Data Science student with deep hands-on expertise in Machine Learning model training, Power BI, advanced Excel, and data analytics — developing websites, intelligent automation workflows, and AI tools to solve real-world problems.",
            education: "B.Tech Computer Science and Engineering (Data Science) 2023-2027 at Lovely Professional University, CGPA: 8.02",
            stats: "2027 B.Tech CSE | 8.02 CGPA | 240+ Google Arcade Labs | Data Science & AI Focus",
            location: "Andhra Pradesh / Punjab, India",
            email: "seelamvamsisivaganesh@gmail.com",
            phone: "+91 9346147336",
            skills: {
                dataScienceMl: ["Machine Learning Model Training", "Predictive Modeling", "Scikit-learn", "TensorFlow", "Feature Engineering", "Model Evaluation & Tuning", "Pandas & NumPy", "Data Preprocessing"],
                businessIntelligence: ["Power BI Dashboards", "Advanced Excel (Formulas, Pivot Tables, Financial/Data Modeling)", "SQL Data Extraction", "Exploratory Data Analysis (EDA)", "Tableau", "Statistical Analysis"],
                aiSpeech: ["Large Language Models (LLMs)", "RAG Architectures", "AI Agents & Autonomous Workflows", "Deepgram Nova-2 STT", "Speaker Diarization", "Generative AI"],
                automationBackend: ["Python", "FastAPI & REST APIs", "n8n Workflow Automation", "MCP (Model Context Protocol)", "Webhooks", "Telegram Bots", "Node.js"],
                databases: ["PostgreSQL", "MongoDB", "Supabase", "SQLite", "Google Sheets Workflows", "Redis"],
                aiWebTools: ["Developing Web Interfaces using AI", "Interactive Analytics Dashboards", "Rapid UI Prototyping", "Docker", "Git/GitHub", "Google Cloud", "Vercel"]
            },
            featuredProjects: [
                "Sentinel Risk Engine: End-to-end data engineering & real-time risk intelligence platform for UPI payment networks (TransOrg AgentIQ Datathon — Track 1: FinTech & BFSI). Resolves high-noise distributed anomalies across 65,000+ raw records across four payment domains using Python data pipelines, Next.js live risk dashboard, and in-memory FastMCP Natural Language Query (NLQ) AI Analyst. Repo: https://github.com/Svamsi2006/datathon",
                "Balaveerulu AI: AI-powered personalized comic platform transforming prompts and user details into illustrated stories with n8n workflows, Supabase, and Razorpay. Live at https://balaveerulu.seelam.app | Repo: https://github.com/Svamsi2006/balaveerulu",
                "LPU Now: Open-source real-time university communication platform with messaging, group chats, announcements, and peer-to-peer voice calling using Socket.IO + WebRTC. Verified repo at https://github.com/Svamsi2006/lpunow | Live at https://lpunow.seelam.app",
                "Smart-Audit AI: AI-assisted call auditing and revenue-leakage analysis system using Deepgram Nova-2 speech-to-text, speaker diarization, and SOP compliance scoring. Solved customer-support revenue leakage by analyzing 101 call records across 38 agents and identifying 7 leakage cases (Battery Smart Finalist, Team Lead + Research Developer)."
            ],
            aiAutomationProjects: [
                "Sentinel Risk Engine: UPI fraud ring detection, graph entity resolution & FastMCP AI analyst (https://github.com/Svamsi2006/datathon).",
                "Context-Preserving PII Redaction Tool: Production-grade context-preserving PII redaction tool for MS Word (.docx) documents, replacing PII with consistent synthetic identities across corporate prospectuses and nested tables (https://github.com/Svamsi2006/scalar).",
                "Document Intelligence & Question Extraction: Production-focused document intelligence service extracting questions, tables, and structured data from digital and scanned PDFs using FastAPI, PyMuPDF, OCR, and Celery (https://github.com/Svamsi2006/pbhack).",
                "Deep Research Engine: Autonomous multi-agent research assistant for software engineers, automating deep technical research, documentation synthesis, and report generation (https://github.com/Svamsi2006/deep-research-engine).",
                "AI Sales Order Assistant: AI-powered sales/order automation workflow connecting conversational interfaces with business actions via n8n and MCP."
            ],
            dataScienceProjects: [
                "Sentinel Risk Engine: 65,000+ payment records entity resolution, graph relational linking, and fraud ring detection (https://github.com/Svamsi2006/datathon).",
                "Zomato India Multi-City Restaurant Study: Curated 36,633 records across 100 cities with inferential statistics, rating predictions, and EDA.",
                "Indian Census EDA Project: In-depth exploratory data analysis uncovering demographic and socioeconomic patterns with Python, Pandas, and Seaborn.",
                "Loan Prediction Machine Learning Model: Trained predictive classification model using Scikit-learn for loan approval risk evaluation."
            ],
            experience: [
                "Smart-Audit AI - Team Lead + Research Developer: AI-powered call auditing, speech processing, revenue-leakage analysis, SOP evaluation, and analytics (Battery Smart Finalist).",
                "Balaveerulu - Founder & CEO: Directing AI personalized comic platform, story generation, n8n automations, and e-commerce workflows.",
                "Google Cloud Arcade Participant: Completed 240+ cloud labs, earning hands-on experience in cloud infrastructure, containers, and AI services.",
                "Tata Consultancy Services (Forage) - Data Visualization Simulation (2025)",
                "Graphic Design Intern - Near to College (2023)"
            ],
            certifications: [
                "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
                "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
                "freeCodeCamp Responsive Web Design",
                "NPTEL Cloud Computing",
                "TCS Forage Data Visualization",
                "GUVI Generative AI",
                "Google Arcade - 240+ Labs Completed"
            ],
            socialLinks: {
                github: "https://github.com/Svamsi2006",
                sentinelRepo: "https://github.com/Svamsi2006/datathon",
                scalarRepo: "https://github.com/Svamsi2006/scalar",
                pbhackRepo: "https://github.com/Svamsi2006/pbhack",
                lpunowRepo: "https://github.com/Svamsi2006/lpunow",
                balaveeruluRepo: "https://github.com/Svamsi2006/balaveerulu",
                deepResearchRepo: "https://github.com/Svamsi2006/deep-research-engine",
                portfolio: "https://seelam.app",
                linkedin: "https://www.linkedin.com/in/vamsi-/",
                whatsapp: "https://wa.me/919346147336"
            }
        };
    }
    
    toggleChat() {
        console.log('toggleChat called, current isOpen:', this.isOpen);
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        console.log('Opening chat...');
        this.isOpen = true;
        this.chatContainer.classList.add('active');
        this.chatInput.focus();
        this.hideNotification();
        
        // Track event
        trackEvent('chat_opened');
        console.log('Chat opened successfully');
    }
    
    closeChat() {
        console.log('Closing chat...');
        this.isOpen = false;
        this.chatContainer.classList.remove('active');
        console.log('Chat closed successfully');
    }
    
    showNotification() {
        this.chatNotification.style.opacity = '1';
        this.chatNotification.style.visibility = 'visible';
        this.chatNotification.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }
    
    hideNotification() {
        this.chatNotification.style.opacity = '0';
        this.chatNotification.style.visibility = 'hidden';
        this.chatNotification.style.transform = 'translateY(10px)';
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Get AI response
            console.log('💬 User message:', message);
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
            console.log('✅ Message sent successfully');
        } catch (error) {
            this.hideTyping();
            console.error('❌ Chat error details:', error);
            
            // Try fallback response first
            const fallbackResponse = this.getFallbackResponse(message);
            if (fallbackResponse) {
                this.addMessage(`${fallbackResponse}\n\n⚠️ Note: AI live chat is running in offline fallback mode.`, 'bot');
                return;
            }
            
            let errorMessage = "I'm sorry, I'm having trouble connecting right now.";
            
            if (error.message.includes('OPENROUTER_API_KEY') || error.message.includes('500')) {
                errorMessage = "⚠️ Chat server configuration issue. Please try again soon or contact Vamsi directly.";
            } else if (error.message.includes('403')) {
                errorMessage = "🔑 API access issue. Please contact Vamsi directly!";
            } else if (error.message.includes('400')) {
                errorMessage = "📝 Message format issue. Try rephrasing your question!";
            } else if (error.message.includes('Network')) {
                errorMessage = "🌐 Network issue. Please check your connection and try again!";
            }
            
            errorMessage += "\n\n📧 Email: seelamvamsisivaganesh@gmail.com\n📱 WhatsApp: +91 9346147336";
            
            this.addMessage(errorMessage, 'bot');
        }
        
        // Track event
        trackEvent('chat_message_sent', { message: message.substring(0, 50) });
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p style="white-space: pre-line;">${text}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showTyping() {
        this.isTyping = true;
        this.chatTyping.style.display = 'flex';
        this.chatSend.disabled = true;
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTyping() {
        this.isTyping = false;
        this.chatTyping.style.display = 'none';
        this.chatSend.disabled = false;
    }
    
    async getAIResponse(userMessage) {
        console.log('🌐 Chat API Endpoint:', this.apiEndpoint);
        console.log('🌐 Current URL:', window.location.href);

        if (window.location.protocol === 'file:') {
            throw new Error('Local static mode detected. Run with Vercel dev or deploy to Vercel to use /api/chat.');
        }
        
        const context = this.createContextPrompt(userMessage);
        console.log('📝 Context prompt created');
        console.log('📤 Sending request to chat API...');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    context
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            console.log('📥 Response received:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Chat API Error Response:', errorText, 'Status:', response.status);
                
                if (response.status === 404) {
                    throw new Error('Chat API route not found at ' + this.apiEndpoint + '. Ensure /api/chat.js is deployed on Vercel.');
                } else if (response.status === 500 && errorText.includes('OPENROUTER_API_KEY')) {
                    throw new Error('OPENROUTER_API_KEY not set in Vercel environment variables. Please add it in Vercel Project Settings.');
                } else if (response.status === 500) {
                    throw new Error(`Server error (500). Details: ${errorText.substring(0, 100)}`);
                }
                throw new Error(`Chat API Error (${response.status}): ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Chat API response successful');

            if (data && data.reply) return data.reply;

            console.error('❌ Unexpected response format:', data);
            throw new Error('Unexpected response format from chat API');
        } catch (error) {
            console.error('❌ Fetch error:', error);
            throw error;
        }
    }
    
    createContextPrompt(userMessage) {
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        const isGreeting = greetings.some(greeting => 
            userMessage.toLowerCase().includes(greeting)
        );
        
        let baseContext = `You are Vamsi's AI assistant on his portfolio website (https://seelam.app). You represent ${this.portfolioData.name}, a ${this.portfolioData.role}.
${this.portfolioData.headline}

IMPORTANT GUIDELINES:
- Be friendly, technical, and accurate about Vamsi's real strengths
- Present Vamsi as a Data Science Student who has strong mastery in Machine Learning model training, Power BI, Advanced Excel, and Python — who develops websites, tools, and automation workflows using AI to solve practical real-world problems (do NOT position him as a generic React/frontend developer).
- Keep responses concise (2-4 sentences max)
- When asked about projects, highlight the problems he solved using AI and data science:
  1. Smart-Audit AI (Call auditing & revenue leakage detection using Deepgram Nova-2 STT, Team Lead)
  2. Balaveerulu AI (Personalized AI comic platform, n8n + Supabase + Razorpay) - balaveerulu.seelam.app
  3. LPU Now (Real-time university communication platform with Socket.IO + WebRTC peer-to-peer voice calling) - github.com/Svamsi2006/lpunow
  4. AI Sales Order Assistant (n8n + MCP conversational automation)
  5. Document Intelligence & Question Extraction (FastAPI + OCR + PyMuPDF prototype)
  6. Data Science Projects: Zomato India EDA, Indian Census EDA, Loan Prediction ML model
- If asked about contact, provide his email: ${this.portfolioData.email} or WhatsApp: ${this.portfolioData.phone}
- GitHub profile: https://github.com/Svamsi2006

PROFILE:
- Name: ${this.portfolioData.name}
- Role: ${this.portfolioData.role}
- Education: ${this.portfolioData.education}
- Quick Stats: ${this.portfolioData.stats}
- Location: ${this.portfolioData.location}

SKILLS:
- Data Science & ML: ${this.portfolioData.skills.dataScienceMl.join(', ')}
- Business Intelligence: ${this.portfolioData.skills.businessIntelligence.join(', ')}
- AI & Speech: ${this.portfolioData.skills.aiSpeech.join(', ')}
- Automation & Backend: ${this.portfolioData.skills.automationBackend.join(', ')}
- Databases: ${this.portfolioData.skills.databases.join(', ')}
- AI Web Tools: ${this.portfolioData.skills.aiWebTools.join(', ')}

FEATURED PROJECTS:
${this.portfolioData.featuredProjects.join('\n')}

AI & AUTOMATION PROJECTS:
${this.portfolioData.aiAutomationProjects.join('\n')}

DATA SCIENCE PROJECTS:
${this.portfolioData.dataScienceProjects.join('\n')}

EXPERIENCE & LEADERSHIP:
${this.portfolioData.experience.join('\n')}

CERTIFICATIONS:
${this.portfolioData.certifications.join(', ')}
`;

        if (isGreeting) {
            return `${baseContext}
User said: "${userMessage}"

This is a greeting. Respond warmly and introduce yourself as Vamsi's AI assistant. Mention you can answer questions about his Data Science projects, Machine Learning models, Power BI & Excel dashboards, and AI tools. Keep it concise.`;
        } else {
            return `${baseContext}
User asked: "${userMessage}"

Provide a helpful, crisp, and technically accurate response based strictly on Vamsi's portfolio facts. If the query asks for something not covered, politely suggest contacting Vamsi directly.`;
        }
    }
    
    // Fallback responses for when AI is not available
    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('featured') || (message.includes('project') && !message.includes('more') && !message.includes('archive'))) {
            return "🚀 **Vamsi's Flagship AI & Data Science Projects:**\n1. **Sentinel Risk Engine**: UPI fraud ring detection, merchant anomaly scoring & in-memory FastMCP AI agent for 65k+ payment records (TransOrg AgentIQ Datathon — Track 1: FinTech & BFSI) — [github.com/Svamsi2006/datathon](https://github.com/Svamsi2006/datathon)\n2. **Balaveerulu AI**: Personalized AI comic generation tool with n8n & Supabase — [balaveerulu.seelam.app](https://balaveerulu.seelam.app/)\n3. **LPU Now**: Open-source real-time university communication system with WebRTC peer-to-peer voice calling — [github.com/Svamsi2006/lpunow](https://github.com/Svamsi2006/lpunow)\n4. **Smart-Audit AI**: Call auditing & revenue-leakage detection using Deepgram Nova-2 speech-to-text (Battery Smart Finalist, 101 calls analyzed, 7 leakages detected)\n5. **Context-Preserving PII Redactor**: Production-grade MS Word (.docx) context-preserving redaction engine — [github.com/Svamsi2006/scalar](https://github.com/Svamsi2006/scalar)\n6. **Document Intelligence & Question Extraction**: FastAPI + PyMuPDF + OCR service — [github.com/Svamsi2006/pbhack](https://github.com/Svamsi2006/pbhack)";
        } else if (message.includes('skill') || message.includes('stack') || message.includes('tech') || message.includes('power bi') || message.includes('excel')) {
            return "💻 **Skills & Competencies:**\n• **Data Science & ML:** Machine Learning Model Training, Scikit-learn, TensorFlow, Predictive Modeling, Feature Engineering, Pandas, NumPy\n• **BI & Analytics:** Power BI (Interactive Dashboards), Advanced Excel (Formulas, Pivot Tables, Data Modeling), SQL, Tableau, EDA\n• **AI & Speech Intelligence:** LLMs, RAG, AI Agents, FastMCP, Deepgram Nova-2 STT, Speaker Diarization\n• **AI Tools & Automation:** Developing Web Tools using AI, FastAPI, n8n Workflows, MCP, PostgreSQL, Supabase, Docker, Google Cloud";
        } else if (message.includes('experience') || message.includes('lead') || message.includes('work')) {
            return "💼 **Experience & Leadership:**\n• **Sentinel Risk Engine (Datathon FinTech Project):** Engineered real-time UPI fraud ring detection and FastMCP NLQ agent across 65k+ records.\n• **Smart-Audit AI (Team Lead + Research Developer):** Led AI call auditing, speech-to-text diarization, and revenue-leakage analysis across 101 customer conversations.\n• **Balaveerulu (Founder & CEO):** Created an AI-powered personalized comic generation platform.\n• **Google Cloud Arcade:** Completed 240+ cloud labs.";
        } else if (message.includes('cert') || message.includes('credential')) {
            return "🏅 **Verified Certifications:**\n• Oracle Cloud Infrastructure 2025 Data Science Professional\n• Oracle Cloud Infrastructure 2025 Generative AI Professional\n• freeCodeCamp Responsive Web Design\n• NPTEL Cloud Computing\n• TCS Forage Data Visualization\n• GUVI Generative AI\n• 240+ Google Arcade Labs Completed";
        } else if (message.includes('github') || message.includes('repo') || message.includes('code') || message.includes('open source')) {
            return "🐙 **Building in Public (Verified GitHub Repositories):**\n• **Sentinel Risk Engine:** https://github.com/Svamsi2006/datathon\n• **PII Redaction Tool:** https://github.com/Svamsi2006/scalar\n• **Document Intelligence (pbhack):** https://github.com/Svamsi2006/pbhack\n• **LPU Now:** https://github.com/Svamsi2006/lpunow\n• **Balaveerulu:** https://github.com/Svamsi2006/balaveerulu\n• **Deep Research Engine:** https://github.com/Svamsi2006/deep-research-engine";
        } else if (message.includes('contact') || message.includes('reach') || message.includes('email') || message.includes('hire')) {
            return "📧 Reach Vamsi directly at seelamvamsisivaganesh@gmail.com or via WhatsApp at +91 9346147336. He is open to Data Science, Machine Learning, and AI Solutions roles and collaborations!";
        } else if (message.includes('education') || message.includes('study') || message.includes('college') || message.includes('cgpa')) {
            return "🎓 Vamsi is pursuing B.Tech in Computer Science and Engineering (Data Science) at Lovely Professional University (2023-2027) with a current CGPA of 8.02.";
        } else {
            return "👋 Hi! I'm Vamsi's AI assistant. Ask me about his Data Science projects, Machine Learning models, Power BI & Excel dashboards, or how he develops websites and tools using AI to solve problems!";
        }
    }
}

// Data Science Animation System
class DataScienceDemo {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.particles = [];
        this.sparkles = [];
        this.isAutoMode = false;
        this.autoInterval = null;
        this.cleanData = [
            { id: 1, name: 'Alice', age: 28, score: 95, status: 'Active' },
            { id: 2, name: 'Bob', age: 32, score: 87, status: 'Active' },
            { id: 3, name: 'Carol', age: 25, score: 92, status: 'Pending' },
            { id: 4, name: 'David', age: 29, score: 88, status: 'Active' },
            { id: 5, name: 'Eve', age: 31, score: 96, status: 'Complete' }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.canvas) return;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.createParticleBackground();
        this.createDataParticles();
        this.animate();
        
        // Auto start after 2 seconds
        setTimeout(() => {
            this.startDataCleaning();
        }, 2000);
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupEventListeners() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const autoBtn = document.getElementById('autoBtn');
        
        startBtn?.addEventListener('click', () => this.startDataCleaning());
        resetBtn?.addEventListener('click', () => this.resetDemo());
        autoBtn?.addEventListener('click', () => this.toggleAutoMode());
    }
    
    createParticleBackground() {
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    createDataParticles() {
        const dataChars = ['A', 'B', '1', '2', '#', '@', '$', '%', '&', '*'];
        const container = document.getElementById('dataParticles');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = dataChars[Math.floor(Math.random() * dataChars.length)];
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particle.style.left = `${Math.random() * 80 + 10}%`;
            particle.style.top = `${Math.random() * 80 + 10}%`;
            container.appendChild(particle);
        }
    }
    
    async startDataCleaning() {
        this.clearTable();
        await this.createFallingParticles();
        await this.populateCleanTable();
        this.createSparkleEffect();
    }
    
    async createFallingParticles() {
        const dataChars = ['A', 'B', '1', '2', '#', '@', '$', '%', '&', '*'];
        const bowl = document.querySelector('.data-bowl');
        if (!bowl) return;
        
        const bowlRect = bowl.getBoundingClientRect();
        const containerRect = bowl.closest('.data-science-demo').getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'falling-particle';
            particle.textContent = dataChars[Math.floor(Math.random() * dataChars.length)];
            
            const startX = bowlRect.left - containerRect.left + Math.random() * bowlRect.width;
            const startY = bowlRect.top - containerRect.top + bowlRect.height / 2;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.animationDelay = `${i * 0.1}s`;
            
            bowl.closest('.data-science-demo').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
        
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    async populateCleanTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;
        
        for (let i = 0; i < this.cleanData.length; i++) {
            const row = document.createElement('tr');
            const data = this.cleanData[i];
            
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.age}</td>
                <td>${data.score}</td>
                <td>${data.status}</td>
            `;
            
            row.style.animationDelay = `${i * 0.2}s`;
            tableBody.appendChild(row);
            
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    
    clearTable() {
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = '';
        }
    }
    
    createSparkleEffect() {
        const container = document.querySelector('.data-science-demo');
        if (!container) return;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animationDelay = `${Math.random() * 2}s`;
                
                container.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 200);
        }
    }
    
    resetDemo() {
        this.clearTable();
        this.createDataParticles();
        
        // Remove falling particles
        document.querySelectorAll('.falling-particle').forEach(p => p.remove());
        document.querySelectorAll('.sparkle').forEach(s => s.remove());
    }
    
    toggleAutoMode() {
        const autoBtn = document.getElementById('autoBtn');
        if (!autoBtn) return;
        
        this.isAutoMode = !this.isAutoMode;
        
        if (this.isAutoMode) {
            autoBtn.classList.add('active');
            this.autoInterval = setInterval(() => {
                this.startDataCleaning();
            }, 8000);
        } else {
            autoBtn.classList.remove('active');
            if (this.autoInterval) {
                clearInterval(this.autoInterval);
                this.autoInterval = null;
            }
        }
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw background particles
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Chat Widget when DOM is ready
// ==================== CERTIFICATE YEAR FILTER ====================
function initCertFilter() {
    const btns = document.querySelectorAll('.cert-filter-btn');
    const carousel = document.getElementById('certificatesCarousel');
    if (!btns.length || !carousel) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            carousel.querySelectorAll('.certificate-card, .cert-expand-card').forEach(card => {
                const yearEl = card.querySelector('.year');
                if (!yearEl) return;
                if (filter === 'all' || yearEl.textContent.trim() === filter) {
                    card.classList.remove('cert-hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('cert-hidden');
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==================== FEATURED PROJECTS SLIDING SHOWCASE ====================
function initFeaturedSlider() {
    const windowEl = document.getElementById('featuredSliderWindow');
    const track = document.getElementById('featuredSliderTrack');
    const slides = document.querySelectorAll('.featured-slide-item');
    const tabs = document.querySelectorAll('.featured-tab-btn');
    const dots = document.querySelectorAll('.featured-dot');
    const prevBtn = document.getElementById('featuredPrevBtn');
    const nextBtn = document.getElementById('featuredNextBtn');
    const progressFill = document.getElementById('featuredSliderProgress');
    const currentNumEl = document.getElementById('currentSlideNum');
    const autoplayToggle = document.getElementById('featuredAutoplayToggle');
    const autoplayIcon = document.getElementById('featuredAutoplayIcon');
    const autoplayLabel = document.getElementById('featuredAutoplayLabel');

    if (!windowEl || !track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const SLIDE_DURATION = 6000; // 6 seconds auto-slide
    let isPlaying = true;
    let isHovered = false;
    let animFrameId = null;
    let startTime = null;
    let elapsedBeforePause = 0;

    function updateUI(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active class on slides
        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx === currentIndex);
        });

        // Update tabs
        tabs.forEach((tab, idx) => {
            const isActive = idx === currentIndex;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });

        // Update counter
        if (currentNumEl) {
            currentNumEl.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        // Reset progress bar
        resetProgressBar();
    }

    function resetProgressBar() {
        if (progressFill) progressFill.style.width = '0%';
        elapsedBeforePause = 0;
        startTime = performance.now();
    }

    function progressLoop(timestamp) {
        if (!isPlaying || isHovered) {
            animFrameId = requestAnimationFrame(progressLoop);
            return;
        }

        if (!startTime) startTime = timestamp;
        const currentElapsed = timestamp - startTime + elapsedBeforePause;
        const progress = Math.min(currentElapsed / SLIDE_DURATION, 1);

        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }

        if (progress >= 1) {
            startTime = timestamp;
            elapsedBeforePause = 0;
            updateUI(currentIndex + 1);
        }

        animFrameId = requestAnimationFrame(progressLoop);
    }

    function startAutoPlay() {
        isPlaying = true;
        startTime = performance.now();
        if (autoplayIcon) autoplayIcon.className = 'fas fa-pause';
        if (autoplayLabel) autoplayLabel.textContent = 'Auto-slide (6s)';
        if (!animFrameId) {
            animFrameId = requestAnimationFrame(progressLoop);
        }
    }

    function pauseAutoPlay() {
        isPlaying = false;
        if (autoplayIcon) autoplayIcon.className = 'fas fa-play';
        if (autoplayLabel) autoplayLabel.textContent = 'Paused';
    }

    // Toggle button
    if (autoplayToggle) {
        autoplayToggle.addEventListener('click', () => {
            if (isPlaying) {
                pauseAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    }

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateUI(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateUI(currentIndex + 1);
        });
    }

    // Tab buttons
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.dataset.slideIndex, 10);
            if (!isNaN(idx)) updateUI(idx);
        });
    });

    // Dot indicators
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.slideIndex, 10);
            if (!isNaN(idx)) updateUI(idx);
        });
    });

    // Hover pause: pause timer while inspecting slide
    windowEl.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    windowEl.addEventListener('mouseleave', () => {
        isHovered = false;
        startTime = performance.now();
    });

    // Keyboard navigation
    windowEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            updateUI(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            updateUI(currentIndex + 1);
        }
    });

    // Touch swipe for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;

    windowEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isHovered = true;
    }, { passive: true });

    windowEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Ensure horizontal intent
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                updateUI(currentIndex - 1);
            } else {
                updateUI(currentIndex + 1);
            }
        }
        isHovered = false;
        startTime = performance.now();
    }, { passive: true });

    // Start auto-play
    updateUI(0);
    startAutoPlay();
}

// ==================== EXPANDABLE ACCORDION / DRAWER CARDS ====================
function initExpandableCards() {
    // 1. Featured Projects Suite
    const featCards = document.querySelectorAll('.expandable-project');
    featCards.forEach(card => {
        const header = card.querySelector('.expandable-project-header');
        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                const isCurrentlyExpanded = card.classList.contains('expanded');
                // Accordion behavior: close others if opening
                featCards.forEach(c => c.classList.remove('expanded'));
                if (!isCurrentlyExpanded) {
                    card.classList.add('expanded');
                }
            });
        }
    });

    // 2. AI Automation Cards
    const aiCards = document.querySelectorAll('.ai-expand-card');
    aiCards.forEach(card => {
        const header = card.querySelector('.ai-expand-header');
        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                card.classList.toggle('expanded');
            });
        }
    });

    // 3. Certificates Cards
    const certCards = document.querySelectorAll('.cert-expand-card');
    certCards.forEach(card => {
        const header = card.querySelector('.cert-expand-header');
        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                card.classList.toggle('expanded');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCertFilter();
    initFeaturedSlider();
    initExpandableCards();
    console.log('🚀 DOM loaded, initializing components...');
    
    // Initialize chat widget after a delay to ensure all other scripts are loaded
    setTimeout(() => {
        try {
            console.log('📡 Creating chat widget instance...');
            window.chatWidget = new ChatWidget();
            console.log('✅ Chat widget initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize chat widget:', error);
        }
    }, 1000);
    
    // Initialize data science demo
    setTimeout(() => {
        try {
            console.log('🔬 Creating data science demo...');
            window.dataScienceDemo = new DataScienceDemo();
            console.log('✅ Data science demo initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize data science demo:', error);
        }
    }, 1500);
});
