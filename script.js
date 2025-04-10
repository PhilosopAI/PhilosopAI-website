// --- Use window.onload to wait for all resources (including scripts like Lucide) ---
window.onload = () => {
    console.log('Window fully loaded (HTML, CSS, JS, Images)'); // Debug log

    try { // Add a try...catch block for better error handling

        // Set Current Year in Footer
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        } else {
            console.error('Element with ID "current-year" not found.');
        }


        // --- GSAP Animations ---
        // Ensure GSAP and ScrollTrigger are loaded (they should be if window.onload fired)
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            console.log('GSAP ScrollTrigger registered'); // Debug log

            // Hero Animation
            gsap.from(".hero-element", {
                duration: 0.8,
                opacity: 0,
                y: 30,
                stagger: 0.2,
                delay: 0.2, // Keep a small delay after load
                ease: "power2.out",
                onComplete: startTypewriter // Use function reference
            });
            console.log('Hero animation initiated'); // Debug log

            // Animate Blob Backgrounds
            gsap.to(".animate-blob", {
                duration: 12,
                x: () => gsap.utils.random(-30, 30, 5),
                y: () => gsap.utils.random(-40, 40, 5),
                scale: () => gsap.utils.random(0.9, 1.1),
                rotation: () => gsap.utils.random(-20, 20),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    each: 0.5,
                    repeat: -1,
                    yoyo: true
                }
            });

            // Scroll-Triggered Animations for Sections
            gsap.utils.toArray('.section-reveal').forEach((element, index) => {
                const delay = parseFloat(element.style.getPropertyValue('--animation-delay')) || 0;
                // console.log(`Setting up ScrollTrigger for element ${index + 1} with delay ${delay}`); // Debug log

                gsap.fromTo(element,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        delay: delay,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 85%',
                            end: 'bottom 15%',
                            toggleActions: 'play none none none',
                            // markers: true, // Uncomment for debugging
                            once: true
                        }
                    }
                );
            });
            console.log('ScrollTrigger animations initiated'); // Debug log

        } else {
             console.error('GSAP or ScrollTrigger library not loaded.');
             // Handle the error - animations won't work
        }


        // --- Typewriter Effect ---
        const typewriterElement = document.getElementById('typewriter');
        const textToType = "It doesn’t just respond—it resonates.";
        let charIndex = 0;

        function typeChar() {
            if (!typewriterElement) {
                // console.error('Typewriter element not found.'); // Already handled in startTypewriter
                return;
            }
            if (charIndex < textToType.length) {
                typewriterElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, Math.random() * 100 + 50);
            }
        }

        function startTypewriter() {
            if (!typewriterElement) {
                console.error('Cannot start typewriter: element not found.');
                return;
            }
            // Check if hero animation actually made the container visible
            const typewriterContainer = typewriterElement.closest('.typewriter-container');
            if (typewriterContainer && parseFloat(getComputedStyle(typewriterContainer).opacity) > 0.5) {
                console.log('Starting typewriter effect'); // Debug log
                typewriterElement.textContent = ''; // Clear previous content
                charIndex = 0;
                setTimeout(typeChar, 500); // Start typing after a short delay
            } else {
                // If the container is still hidden (e.g., if hero animation failed), don't start typing
                console.warn('Typewriter container not visible, typewriter will not start.');
                // Optionally retry, but if GSAP failed, it might loop indefinitely
                // setTimeout(startTypewriter, 200);
            }
        }
         // Initial call to startTypewriter is done via GSAP onComplete

        // --- Smooth Scrolling for Nav Links & CTA ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else {
                        console.warn(`Smooth scroll target "${targetId}" not found.`);
                    }
                } catch (error) {
                     console.error(`Error finding smooth scroll target "${targetId}": ${error}`);
                }
            });
        });

        // --- Waitlist Form Handling (Front-end only) ---
        const waitlistForm = document.getElementById('waitlist-form');
        const formMessage = document.getElementById('form-message');

        if (waitlistForm && formMessage) {
            waitlistForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    formMessage.textContent = 'Thank you! You\'ve been added to the waitlist.';
                    formMessage.classList.remove('text-red-400'); // Ensure no error class
                    formMessage.classList.add('text-green-400');
                    const emailValue = emailInput.value;
                    emailInput.value = '';

                    setTimeout(() => {
                        formMessage.textContent = '';
                    }, 5000);

                    console.log(`Waitlist submission (simulation): ${emailValue}`);
                } else {
                     console.error('Email input element not found in waitlist form.');
                }
            });
        } else {
            console.warn('Waitlist form or message element not found.');
        }

    } catch (error) {
         console.error("An error occurred during script initialization:", error);
         // Optionally display an error message to the user on the page
         // document.body.innerHTML = '<p style="color: red; padding: 20px;">An error occurred loading the page content. Please try refreshing.</p>';
    }
}; // End of window.onload listener

lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".section-reveal").forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: el.style.getPropertyValue('--animation-delay') || i * 0.1,
        scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});

const typewriterTexts = [
    "Therapy for the poetic mind.",
    "A whisper in the noise.",
    "Your inner voice, amplified."
];

let index = 0, char = 0;
const typeElement = document.getElementById("typewriter");

function typeLoop() {
    if (!typeElement) return;
    typeElement.textContent = typewriterTexts[index].slice(0, char++);
    if (char <= typewriterTexts[index].length) {
        setTimeout(typeLoop, 70);
    } else {
        setTimeout(() => {
            char = 0;
            index = (index + 1) % typewriterTexts.length;
            typeLoop();
        }, 3000);
    }
}
typeLoop();
