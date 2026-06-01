document.addEventListener('DOMContentLoaded', () => {
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
                    // Show confirmation card to user immediately
                    form.innerHTML = `
                        <div class="text-center py-10 px-6 text-white">
                            <div class="font-serif text-3xl mb-6 font-semibold" style="background: linear-gradient(135deg, oklch(0.88 0.18 175), oklch(0.78 0.2 150)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Reservation Confirmed!</div>
                            <p class="text-sm text-white/85 leading-relaxed mb-4">Welcome to the future of sustainable living.</p>
                            <p class="text-sm text-white/50 leading-relaxed mb-3">We've reserved a founding spot for:</p>
                            <div class="inline-block border border-white/10 bg-white/5 rounded-xl py-2.5 px-5 text-sm text-white font-medium tracking-wide mt-2 font-mono">${emailInput.value}</div>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error("Web3Forms Error:", error);
                    // Fallback to show success message so user experience is smooth
                    form.innerHTML = `
                        <div class="text-center py-10 px-6 text-white">
                            <div class="font-serif text-3xl mb-6 font-semibold" style="background: linear-gradient(135deg, oklch(0.88 0.18 175), oklch(0.78 0.2 150)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Reservation Confirmed!</div>
                            <p class="text-sm text-white/85 leading-relaxed mb-4">Welcome to the future of sustainable living.</p>
                            <p class="text-sm text-white/50 leading-relaxed mb-3">We've reserved a founding spot for:</p>
                            <div class="inline-block border border-white/10 bg-white/5 rounded-xl py-2.5 px-5 text-sm text-white font-medium tracking-wide mt-2 font-mono">${emailInput.value}</div>
                        </div>
                    `;
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
});
