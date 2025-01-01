// This file contains JavaScript code for interactivity, including smooth scroll effects, dynamic content loading using AJAX, form validation, and handling user interactions for elements like buttons, tabs, and loaders.

document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Dynamic content loading using AJAX
    function loadContent(url, targetElement) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.querySelector(targetElement).innerHTML = data;
            })
            .catch(error => console.error('Error loading content:', error));
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            if (isValid) {
                // Handle successful submission
                console.log('Form submitted successfully!');
            }
        });
    });

    // Handling button interactions
    const buttons = document.querySelectorAll('.interactive-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });

    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            const targetContent = document.querySelector(this.dataset.target);
            targetContent.classList.add('active');
        });
    });

    // Load initial content for the first tab
    if (tabs.length > 0) {
        tabs[0].click();
    }

    // Navigation link handling
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target.getAttribute('href');
            fetch(target)
                .then(response => response.text())
                .then(html => {
                    document.querySelector('main').innerHTML = html;
                    window.history.pushState({}, '', target);
                })
                .catch(error => console.error('Error loading page:', error));
        });
    });

    // Neon effect
    const neonCanvas = document.getElementById('neon-canvas');
    if (neonCanvas) {
        const ctx = neonCanvas.getContext('2d');
        let width, height, mouseX, mouseY;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            neonCanvas.width = width;
            neonCanvas.height = height;
        }

        function drawNeonTrail() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0, 255, 255, 1)';
        }

        window.addEventListener('resize', resizeCanvas);
        neonCanvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            drawNeonTrail();
        });

        resizeCanvas();
    }

    // Language change handling
    function changeLanguage(language) {
        const currentUrl = window.location.href;
        if (language === 'en') {
            window.location.href = currentUrl.replace('index.html', 'index_en.html');
        } else {
            window.location.href = currentUrl.replace('index_en.html', 'index.html');
        }
    }

    // Add event listener to language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
});