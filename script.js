window.onload = () => {
    console.log('Window fully loaded (HTML, CSS, JS, Images)');

    try {
        // Set Current Year in Footer
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        } else {
            console.error('Element with ID "current-year" not found.');
        }

        // --- GSAP Animations ---
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            console.log('GSAP ScrollTrigger registered');

            // Hero Animation
            gsap.from(".hero-element", {
                duration: 0.8,
                opacity: 0,
                y: 30,
                stagger: 0.2,
                delay: 0.2,
                ease: "power2.out",
                onComplete: startTypewriter // callback
            });
            console.log('Hero animation initiated');

            // Blob Backgrounds
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

            // Scroll-triggered reveal
            gsap.utils.toArray('.section-reveal').forEach((element) => {
                const delay = parseFloat(element.style.getPropertyValue('--animation-delay')) || 0;
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
                            once: true
                        }
                    }
                );
            });
            console.log('ScrollTrigger animations initiated');
        } else {
            console.error('GSAP or ScrollTrigger library not loaded.');
        }

        // --- Typewriter Effect ---
        const typewriterElement = document.getElementById('typewriter');
        const singleTypewriterText = "It doesn’t just respond—it resonates.";
        const rotatingTexts = [
            "Therapy for the poetic mind.",
            "A whisper in the noise.",
            "Your inner voice, amplified."
        ];
        let charIndex = 0;
        let rotationIndex = 0;

        function typeChar() {
            if (!typewriterElement) return;
            if (charIndex < singleTypewriterText.length) {
                typewriterElement.textContent += singleTypewriterText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, Math.random() * 100 + 50);
            } else {
                // Once done, start rotating loop after delay
                setTimeout(startRotatingTypewriter, 2000);
            }
        }

        function startTypewriter() {
            if (!typewriterElement) return console.error('Typewriter element not found.');
            const container = typewriterElement.closest('.typewriter-container');
            if (container && parseFloat(getComputedStyle(container).opacity) > 0.5) {
                console.log('Starting initial typewriter effect');
                typewriterElement.textContent = '';
                charIndex = 0;
                setTimeout(typeChar, 500);
            } else {
                console.warn('Typewriter container not visible.');
            }
        }

        function startRotatingTypewriter() {
            if (!typewriterElement) return;

            let i = 0;
            let j = 0;
            function loop() {
                typewriterElement.textContent = rotatingTexts[i].slice(0, j++);
                if (j <= rotatingTexts[i].length) {
                    setTimeout(loop, 70);
                } else {
                    setTimeout(() => {
                        j = 0;
                        i = (i + 1) % rotatingTexts.length;
                        loop();
                    }, 3000);
                }
            }

            loop();
        }

        // --- Smooth Scrolling ---
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
                    console.error(`Error in smooth scroll: ${error}`);
                }
            });
        });

        // --- Waitlist Form ---
        const waitlistForm = document.getElementById('waitlist-form');
        const formMessage = document.getElementById('form-message');

        if (waitlistForm && formMessage) {
            waitlistForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    const email = emailInput.value;
                    formMessage.textContent = 'Thank you! You\'ve been added to the waitlist.';
                    formMessage.classList.remove('text-red-400');
                    formMessage.classList.add('text-green-400');
                    emailInput.value = '';
                    console.log(`Waitlist submission (simulated): ${email}`);
                    setTimeout(() => {
                        formMessage.textContent = '';
                    }, 5000);
                } else {
                    console.error('Email input not found.');
                }
            });
        } else {
            console.warn('Waitlist form or message element missing.');
        }

    } catch (error) {
        console.error("An error occurred during script initialization:", error);
    }
};
