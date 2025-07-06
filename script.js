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

        // --- Chat Interface ---
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const chatMessages = document.getElementById('chat-messages');
        
        if (chatInput && sendButton && chatMessages) {
            // Philosophical responses for the prototype
            const philosophicalResponses = [
                "\"Tell me more about this feeling. What does it whisper to you in the quiet moments?\"",
                "\"Perhaps the answer isn't in the having, but in the becoming. What are you becoming through this experience?\"",
                "\"Every question carries its own light. What illuminates your path when you ask this?\"",
                "\"In the space between thoughts, what do you find? Sometimes wisdom lives in the pause.\"",
                "\"You speak of weight—but what if this burden is actually a gift wrapped in difficulty?\"",
                "\"The heart knows truths the mind hasn't learned yet. What is your heart telling you?\"",
                "\"Storms pass, but they also water the seeds we didn't know we planted. What might be growing?\"",
                "\"You are both the question and the answer, the seeker and the sought. How does this sit with you?\"",
                "\"In poetry, we find that the broken places often let the most light through. What light do you see?\"",
                "\"Breathe. In this moment, you are exactly where you need to be. What does this moment teach you?\"",
                "\"The universe is still writing your story. What chapter feels like it's beginning now?\"",
                "\"Sometimes the path forward is found by honoring where we've been. What are you grateful for in this journey?\""
            ];

            let messageCount = 0;

            function addMessage(text, isUser = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'flex items-start space-x-3';
                
                if (isUser) {
                    messageDiv.className += ' flex-row-reverse space-x-reverse';
                    messageDiv.innerHTML = `
                        <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="ri-user-line text-white text-sm"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md ml-auto">
                                <p class="text-gray-200" style="font-family: 'Montserrat';">${text}</p>
                            </div>
                            <p class="text-xs text-gray-500 mt-1 mr-2 text-right">You • just now</p>
                        </div>
                    `;
                } else {
                    messageDiv.innerHTML = `
                        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="ri-brain-line text-white text-sm"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-gray-700/50 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                                <p class="text-gray-200" style="font-family: 'Montserrat';">${text}</p>
                            </div>
                            <p class="text-xs text-gray-500 mt-1 ml-2">PhilosopAI • just now</p>
                        </div>
                    `;
                }
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            function typeMessage(text, callback) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'flex items-start space-x-3';
                messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="ri-brain-line text-white text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <div class="bg-gray-700/50 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                            <p class="text-gray-200 typing-indicator" style="font-family: 'Montserrat';">
                                <span class="typing-text"></span><span class="typing-cursor">|</span>
                            </p>
                        </div>
                        <p class="text-xs text-gray-500 mt-1 ml-2">PhilosopAI • typing...</p>
                    </div>
                `;
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                const typingText = messageDiv.querySelector('.typing-text');
                const typingCursor = messageDiv.querySelector('.typing-cursor');
                const timestamp = messageDiv.querySelector('.text-xs');
                
                let i = 0;
                function type() {
                    if (i < text.length) {
                        typingText.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, Math.random() * 50 + 30);
                    } else {
                        typingCursor.remove();
                        timestamp.textContent = 'PhilosopAI • just now';
                        if (callback) callback();
                    }
                }
                
                setTimeout(type, 800);
            }

            function sendMessage() {
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Add user message
                addMessage(message, true);
                chatInput.value = '';
                
                // Show typing indicator and respond
                setTimeout(() => {
                    const response = philosophicalResponses[messageCount % philosophicalResponses.length];
                    typeMessage(response);
                    messageCount++;
                }, 1000);
            }

            // Event listeners
            sendButton.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            console.log('Chat interface initialized');
        } else {
            console.warn('Chat interface elements missing.');
        }

    } catch (error) {
        console.error("An error occurred during script initialization:", error);
    }
};
