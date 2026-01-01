// ========================================
// Interactive Node Animation with Mouse Interaction
// ========================================

const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Mouse position
const mouse = {
    x: null,
    y: null,
    radius: 150
};

// Node configuration
const nodeConfig = {
    count: 80,
    maxRadius: 3,
    minRadius: 1,
    speed: 0.5,
    connectionDistance: 120,
    mouseConnectionDistance: 200
};

// Node class
class Node {
    constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * (nodeConfig.maxRadius - nodeConfig.minRadius) + nodeConfig.minRadius;
        this.vx = (Math.random() - 0.5) * nodeConfig.speed;
        this.vy = (Math.random() - 0.5) * nodeConfig.speed;
        this.color = `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.3})`;
    }

    update() {
        // Move node
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.vy = -this.vy;
        }

        // Keep within bounds
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
        this.y = Math.max(0, Math.min(canvasHeight, this.y));

        // Mouse interaction - attract or repel
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                
                // Attract towards mouse
                this.vx += Math.cos(angle) * force * 0.05;
                this.vy += Math.sin(angle) * force * 0.05;

                // Limit velocity
                const maxVelocity = 3;
                const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (currentVelocity > maxVelocity) {
                    this.vx = (this.vx / currentVelocity) * maxVelocity;
                    this.vy = (this.vy / currentVelocity) * maxVelocity;
                }
            }
        }

        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create nodes
let nodes = [];
function initNodes() {
    nodes = [];
    for (let i = 0; i < nodeConfig.count; i++) {
        nodes.push(new Node());
    }
}

// Draw connections between nodes
function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nodeConfig.connectionDistance) {
                const opacity = 1 - (distance / nodeConfig.connectionDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
            const dx = nodes[i].x - mouse.x;
            const dy = nodes[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nodeConfig.mouseConnectionDistance) {
                const opacity = 1 - (distance / nodeConfig.mouseConnectionDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.5})`;
                ctx.lineWidth = opacity * 2;
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw connections first (background)
    drawConnections();

    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    initNodes();
});

// Mobile touch support
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

// Initialize and start animation
initNodes();
animate();

// ========================================
// Hamburger Menu Toggle
// ========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// Smooth Scroll Enhancement
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========================================
// Contact Form Handler (Formspree)
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            const response = await fetch('https://formspree.io/f/mykzydkj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                // Error from Formspree
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Network error or other issues
            formStatus.textContent = '✗ Oops! Something went wrong. Please try again or email me directly.';
            formStatus.className = 'form-status error';
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}
