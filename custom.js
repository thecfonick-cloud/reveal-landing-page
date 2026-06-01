document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easeOutExpo curve
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false, // keep natural mobile touch scrolling behavior
            touchMultiplier: 1.5,
            infinite: false
        });

        // Use requestAnimationFrame to drive Lenis updates
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync header navigation link click scrolls with Lenis animation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -20,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });
    }
    // 1. Mobile & Autoplay Video Safety
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.play().catch(err => {
            console.log("Video autoplay blocked, waiting for user interaction:", err);
        });
    });

    // 2. Form Submission Interactions
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = form.querySelector('input[placeholder="Your name"]');
            const emailInput = form.querySelector('input[placeholder="Email address"]');
            const button = form.querySelector('button[type="submit"]');
            const container = form.querySelector('.grid') || form.firstElementChild;
            
            if (button && nameInput && emailInput) {
                // Disable button and inputs
                button.disabled = true;
                nameInput.disabled = true;
                emailInput.disabled = true;
                
                button.innerHTML = 'Reserving...';

                // Send to Web3Forms email API
                const web3formsAccessKey = "a7100639-f466-41b4-854d-792c1441acb2";

                const formData = new FormData();
                formData.append("access_key", web3formsAccessKey);
                formData.append("name", nameInput.value);
                formData.append("email", emailInput.value);
                formData.append("subject", "New ReVeaL Waitlist Reservation!");

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || "Server error: " + response.status);
                        }).catch(() => {
                            throw new Error("Server responded with status: " + response.status);
                        });
                    }
                })
                .then(data => {
                    if (data.success) {
                        // Show confirmation card to user immediately
                        form.innerHTML = `
                            <div class="text-center py-10 px-6 text-white">
                                <div class="font-serif text-3xl mb-6 font-semibold" style="background: linear-gradient(135deg, oklch(0.88 0.18 175), oklch(0.78 0.2 150)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Reservation Confirmed!</div>
                                <p class="text-sm text-white/85 leading-relaxed mb-4">Welcome to the future of sustainable living.</p>
                                <p class="text-sm text-white/50 leading-relaxed mb-3">We've reserved a founding spot for:</p>
                                <div class="inline-block border border-white/10 bg-white/5 rounded-xl py-2.5 px-5 text-sm text-white font-medium tracking-wide mt-2 font-mono">${emailInput.value}</div>
                            </div>
                        `;
                    } else {
                        throw new Error(data.message || "Form submission rejected by email service.");
                    }
                })
                .catch(error => {
                    console.error("Web3Forms Submission Error:", error);
                    // Re-enable form fields to let user modify inputs and try again
                    button.disabled = false;
                    nameInput.disabled = false;
                    emailInput.disabled = false;
                    button.innerHTML = 'Reserve <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-4 w-4 transition group-hover:translate-x-1 shrink-0" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
                    alert("Reservation failed: " + error.message + "\n\nPlease check your internet connection or domain restrictions.");
                });
            }
        });
    }

    // 3. Stat Counter Scroll Animation
    const counters = document.querySelectorAll('.stat-counter');
    
    // Set counters initially to 0
    counters.forEach(counter => {
        counter.textContent = '0';
    });

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // duration in ms
        const startTime = performance.now();

        const updateNumber = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic easeOut curve for premium feel
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(easeProgress * target);
            counter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(updateNumber);
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetCounters = entry.target.querySelectorAll('.stat-counter');
                targetCounters.forEach(counter => {
                    animateCounter(counter);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const impactSection = document.querySelector('#impact');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // 4. Scroll Reveal Animations (Lovable-Style)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before entering view for a smooth feel
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If the element is already inside/above the viewport, reveal it immediately on load
        if (rect.top < window.innerHeight - 20) {
            el.classList.add('revealed');
        } else {
            revealObserver.observe(el);
        }
    });
});
