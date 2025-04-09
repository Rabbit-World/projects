/**
 * Rabbit R1 Device Detection Script
 * 
 * This script attempts to detect if a user is accessing the site from a Rabbit R1 device.
 * Based on research findings:
 * - Rabbit R1 has a 2.88-inch LCD touchscreen
 * - The device doesn't have traditional web browsing capabilities
 * - It runs on AOSP (Android Open Source Project) 13
 * - It has specific dimensions: 3in × 3in × 0.5in (78mm × 78mm × 13mm)
 */

(function() {
    // Main detection function
    function detectRabbitR1() {
        // Initialize detection result
        let isRabbitR1 = false;
        let detectionMethod = 'unknown';
        let confidence = 0;
        
        // 1. Check screen dimensions (Rabbit R1 has a 2.88-inch screen)
        // Convert inches to pixels (approximate at standard density)
        // Assuming ~160 dpi as baseline, 2.88 inches would be roughly 460px diagonal
        // This is an approximation and may need adjustment
        const screenDiagonalPx = Math.sqrt(
            Math.pow(window.screen.width, 2) + 
            Math.pow(window.screen.height, 2)
        );
        
        // Check if screen size is close to Rabbit R1's 2.88-inch screen
        // Allow for some margin of error (±50px)
        if (screenDiagonalPx > 410 && screenDiagonalPx < 510) {
            isRabbitR1 = true;
            detectionMethod = 'screen_size';
            confidence += 40; // 40% confidence based on screen size
        }
        
        // 2. Check user agent for potential AOSP 13 indicators
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('android 13') && !userAgent.includes('mobile')) {
            confidence += 20;
            if (detectionMethod === 'unknown') {
                detectionMethod = 'user_agent';
                isRabbitR1 = true;
            }
        }
        
        // 3. Check for specific aspect ratio (close to 1:1 as it's a square-ish device)
        const aspectRatio = window.screen.width / window.screen.height;
        if (aspectRatio > 0.9 && aspectRatio < 1.1) {
            confidence += 20;
            if (detectionMethod === 'unknown') {
                detectionMethod = 'aspect_ratio';
                isRabbitR1 = true;
            }
        }
        
        // 4. Check for touch capability (Rabbit R1 has a touchscreen)
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            confidence += 10;
        } else {
            // If no touch capability, likely not a Rabbit R1
            confidence -= 30;
            isRabbitR1 = false;
        }
        
        // 5. Check for potential custom headers or cookies that might be set by Rabbit R1
        // This is speculative and would need to be updated if such headers exist
        if (document.cookie.includes('rabbit-device') || 
            (typeof window.rabbitAPI !== 'undefined')) {
            isRabbitR1 = true;
            detectionMethod = 'custom_identifier';
            confidence = 90; // High confidence if custom identifier is found
        }
        
        // Return detection results
        return {
            isRabbitR1: isRabbitR1,
            confidence: Math.min(Math.max(confidence, 0), 100), // Clamp between 0-100
            detectionMethod: detectionMethod,
            deviceInfo: {
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                userAgent: navigator.userAgent,
                touchPoints: navigator.maxTouchPoints || 0
            }
        };
    }
    
    // Function to handle non-Rabbit R1 devices
    function handleNonRabbitDevice() {
        // Check if we should redirect
        const shouldRedirect = !sessionStorage.getItem('rabbit_override');
        
        if (shouldRedirect) {
            // Redirect to restricted page
            window.location.href = 'restricted.html';
        }
    }
    
    // Function to handle Rabbit R1 devices
    function handleRabbitDevice() {
        // Add Rabbit R1 specific optimizations
        document.documentElement.classList.add('rabbit-r1-device');
        
        // Adjust viewport for 2.88-inch screen
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Apply any other Rabbit R1 specific adjustments
        console.log('Rabbit R1 device detected. Applying optimizations.');
    }
    
    // Function to allow manual override of detection
    function setupOverrideOption() {
        // Create override button for testing purposes
        const overrideButton = document.createElement('button');
        overrideButton.id = 'rabbit-override';
        overrideButton.style.position = 'fixed';
        overrideButton.style.bottom = '10px';
        overrideButton.style.right = '10px';
        overrideButton.style.zIndex = '9999';
        overrideButton.style.fontSize = '10px';
        overrideButton.style.padding = '5px';
        overrideButton.style.opacity = '0.7';
        overrideButton.textContent = 'Override Detection';
        
        overrideButton.addEventListener('click', function() {
            sessionStorage.setItem('rabbit_override', 'true');
            window.location.reload();
        });
        
        // Only show in development or with debug parameter
        if (window.location.href.includes('debug=true') || 
            window.location.hostname === 'localhost') {
            document.body.appendChild(overrideButton);
        }
    }
    
    // Main execution
    document.addEventListener('DOMContentLoaded', function() {
        const detectionResult = detectRabbitR1();
        
        // Log detection results (for development)
        console.log('Rabbit R1 Detection:', detectionResult);
        
        // Set a data attribute on html element for CSS targeting
        document.documentElement.setAttribute(
            'data-device-confidence', 
            detectionResult.confidence
        );
        
        // Handle device based on detection
        if (detectionResult.isRabbitR1 && detectionResult.confidence > 50) {
            handleRabbitDevice();
        } else {
            handleNonRabbitDevice();
        }
        
        // Setup override option for testing
        setupOverrideOption();
    });
    
    // Expose detection function globally for potential use by other scripts
    window.detectRabbitR1 = detectRabbitR1;
})();