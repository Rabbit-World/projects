document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize language selector
    initLanguageSelector();
    
    // Initialize FAQ accordions
    initFAQAccordions();
    
    // Initialize device detection
    initDeviceDetection();
    
    // Initialize dark mode toggle
    initDarkModeToggle();
    
    // Load the preferred language or default to English
    loadLanguage(getPreferredLanguage());
});

// Navigation highlighting
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Language selector
function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        // Set initial value based on preferred language
        const preferredLanguage = getPreferredLanguage();
        languageSelector.value = preferredLanguage;
        
        // Add change event listener
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            loadLanguage(selectedLanguage);
            
            // Store the selected language preference
            localStorage.setItem('preferred_language', selectedLanguage);
        });
    }
}

// Get preferred language from localStorage or browser settings
function getPreferredLanguage() {
    // Check if there's a stored preference
    const storedLanguage = localStorage.getItem('preferred_language');
    if (storedLanguage) {
        return storedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    const shortLang = browserLanguage.split('-')[0];
    
    // List of supported languages
    const supportedLanguages = [
        'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 
        'zh-CN', 'zh-TW', 'ar', 'hi', 'sv'
    ];
    
    // Check if browser language is supported
    if (supportedLanguages.includes(browserLanguage)) {
        return browserLanguage;
    }
    
    // Check if short language code is supported
    if (supportedLanguages.includes(shortLang)) {
        return shortLang;
    }
    
    // Default to English
    return 'en';
}

// Load language file and apply translations
async function loadLanguage(lang) {
    try {
        // Add cache-busting parameter to prevent caching issues
        const response = await fetch(`lang/${lang}.json?v=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${response.status}`);
        }
        
        const translations = await response.json();
        
        // Apply translations to the page
        applyTranslations(document.body, translations);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update language selector if it exists
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = lang;
        }
        
        // Store the selected language preference
        localStorage.setItem('preferred_language', lang);
        
        console.log(`Language loaded: ${lang}`);
        
        // Dispatch event for other components to react to language change
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        document.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error(`Error loading language ${lang}:`, error);
        
        // Fall back to English if the requested language fails to load
        if (lang !== 'en') {
            console.log('Falling back to English');
            return loadLanguage('en');
        }
        
        return false;
    }
}

// Apply translations to elements with data-i18n attributes
function applyTranslations(rootElement, translations) {
    const elements = rootElement.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);
        
        if (translation) {
            // For inputs, set placeholder or value
            if (element.tagName === 'INPUT') {
                if (element.type === 'text' || element.type === 'search') {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } 
            // For elements with HTML content
            else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Also handle elements with data-i18n-placeholder
    const placeholderElements = rootElement.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations, key);
        
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Handle elements with data-i18n-title
    const titleElements = rootElement.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getNestedTranslation(translations, key);
        
        if (translation) {
            element.title = translation;
        }
    });
}

// Get nested translation using dot notation
function getNestedTranslation(translations, key) {
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            return undefined;
        }
    }
    
    return result;
}

// FAQ accordions
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                // Toggle active class on the item
                item.classList.toggle('active');
                
                // Toggle visibility of the answer
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
}

// Device detection display
function initDeviceDetection() {
    // Check if device detection function exists (from detect.js)
    if (typeof isRabbitR1 === 'function') {
        const isR1 = isRabbitR1();
        
        // Add device-specific class to body
        document.body.classList.add(isR1 ? 'rabbit-r1-device' : 'other-device');
        
        // Update device info display if it exists
        const deviceInfoElement = document.getElementById('device-info');
        if (deviceInfoElement) {
            deviceInfoElement.textContent = isR1 ? 'Rabbit R1 Detected' : 'Other Device';
        }
        
        // Apply device-specific optimizations
        if (isR1) {
            applyR1Optimizations();
        }
    }
}

// Apply Rabbit R1 specific optimizations
function applyR1Optimizations() {
    // Adjust font sizes for better readability on small screen
    document.body.classList.add('optimize-small-screen');
    
    // Simplify certain UI elements
    const complexElements = document.querySelectorAll('.complex-ui');
    complexElements.forEach(element => {
        element.classList.add('simplified');
    });
    
    // Optimize touch targets for small screen
    const touchTargets = document.querySelectorAll('button, a, .interactive');
    touchTargets.forEach(element => {
        element.classList.add('optimize-touch');
    });
    
    console.log('Applied R1-specific optimizations');
}

// Dark mode toggle
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply the appropriate theme
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.body.classList.add('dark-theme');
            darkModeToggle.checked = true;
        }
        
        // Add change event listener
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Also listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const savedTheme = localStorage.getItem('theme');
        
        // Only apply system preference if user hasn't explicitly set a preference
        if (!savedTheme) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                if (darkModeToggle) darkModeToggle.checked = true;
            } else {
                document.body.classList.remove('dark-theme');
                if (darkModeToggle) darkModeToggle.checked = false;
            }
        }
    });
}

// Export functions for use in other scripts
window.getPreferredLanguage = getPreferredLanguage;
window.loadLanguage = loadLanguage;
window.applyTranslations = applyTranslations;