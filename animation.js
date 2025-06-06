// animation.js

// Animate numbers
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        // Ensure target is a number and not NaN. Default to 0 if not.
        const finalTarget = isNaN(target) ? 0 : target;
        
        const increment = Math.max(1, finalTarget / 100); // Ensure increment is at least 1, avoid division by zero if target is 0
        let current = 0;

        if (finalTarget === 0) { // If target is 0, just set it and return
            number.textContent = 0;
            return;
        }

        const timer = setInterval(() => {
            current += increment;
            if (current >= finalTarget) {
                current = finalTarget;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current);
        }, 20); // Adjust timing for speed if necessary
    });
}

// Initialize floating elements
function initFloatingElements() {
    // Target the specific container in the cert-section
    const floatingElementsContainer = document.querySelector('.cert-section .floating-elements'); 
    
    if (floatingElementsContainer) {
        // Clear any hardcoded elements within this specific container
        // This ensures only dynamically added elements are present if this function is the source of truth.
        floatingElementsContainer.innerHTML = ''; 
        
        const elements = ['🏆', '📜', '⚡', '🎯']; // Using emojis for consistency

        elements.forEach((element, index) => {
            const div = document.createElement('div');
            div.className = 'floating-element';
            div.textContent = element;
            div.style.top = `${Math.random() * 80 + 10}%`; // Random vertical position
            div.style.left = `${Math.random() * 80 + 10}%`; // Random horizontal position
            // Randomize animation delay for a more natural, less synchronized look
            div.style.animationDelay = `${Math.random() * 4}s`; 
            // Optional: Randomize duration slightly for more variation
            // div.style.animationDuration = `${Math.random() * 5 + 5}s`; // e.g., duration between 5s and 10s
            floatingElementsContainer.appendChild(div);
        });
    }
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Aligns the top of the target element to the top of the viewport
                    });
                } else {
                    console.warn(`Smooth scroll target not found: ${targetId}`);
                }
            } catch (error) {
                // Fallback for browsers that don't support complex selectors in querySelector for hrefs (though '#' is fine)
                console.error(`Error finding smooth scroll target: ${targetId}`, error);
                // Potentially use document.getElementById(targetId.substring(1)) if IDs are simple
            }
        });
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Check if the intersecting element is the stats-bar or contains stat-numbers to trigger animation
            if (entry.target.classList.contains('stats-bar') || entry.target.querySelector('.stat-number')) {
                animateNumbers(); // Call animateNumbers for the stat items within the visible stats-bar
            }
            // Optional: Unobserve after animation to prevent re-triggering if not desired
            // observer.unobserve(entry.target); 
        } else {
            // Optional: Reset animation if element scrolls out of view and you want it to re-animate on next intersection
            // This might be desired for elements that should always animate when they become visible.
            // entry.target.style.opacity = '0';
            // entry.target.style.transform = 'translateY(50px)';
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating elements only if a container exists in the cert-section
    if (document.querySelector('.cert-section .floating-elements')) {
        initFloatingElements();
    }

    // Initialize smooth scroll
    initSmoothScroll();

    // Generic class for elements to animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        // Ensure transition is applied for the animation effect
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Specific handling for certification cards if they don't use '.animate-on-scroll'
    // or need staggered animation. If they have '.animate-on-scroll', this might be redundant.
    document.querySelectorAll('.cert-card').forEach((card, index) => {
        // Check if already handled by generic .animate-on-scroll to avoid double styling
        if (!card.classList.contains('animate-on-scroll')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        }
        // Apply staggered delay regardless, or only if not .animate-on-scroll
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card); // Observe cards for intersection
    });

    // Animate stats bar container (if it's separate from .animate-on-scroll items)
    // And trigger number animation when it becomes visible.
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        // If statsBar itself should animate in
        if (!statsBar.classList.contains('animate-on-scroll')) {
            statsBar.style.opacity = '0';
            statsBar.style.transform = 'translateY(50px)';
            statsBar.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        observer.observe(statsBar); // Observe stats bar to trigger number animation
    }

    // Card hover effects (z-index adjustment for overlap)
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10'; // Bring card to front on hover
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1'; // Reset z-index
        });
    });
});