/**
 * Rabbit R1 Guide - Update Mechanism
 * 
 * This file handles checking for updates, notifying users,
 * and applying updates to specific content modules.
 */

// Configuration
const UPDATE_CHECK_INTERVAL = 86400000; // Check once per day (in milliseconds)
const UPDATE_STORAGE_KEY = 'r1_guide_updates';
const VERSION_FILE = 'version.json';
const DEBUG_MODE = false;

// Current version information (loaded from version.json)
let currentVersionInfo = null;

/**
 * Initialize the update mechanism
 */
function initUpdateMechanism() {
    // Load current version information
    loadVersionInfo()
        .then(() => {
            // Check for updates immediately on load
            checkForUpdates();
            
            // Set up periodic update checks
            setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);
            
            // Set up update notification UI
            setupUpdateNotificationUI();
            
            log('Update mechanism initialized');
        })
        .catch(error => {
            console.error('Failed to initialize update mechanism:', error);
        });
}

/**
 * Load the current version information from version.json
 */
async function loadVersionInfo() {
    try {
        const response = await fetch(VERSION_FILE + '?t=' + new Date().getTime());
        if (!response.ok) {
            throw new Error(`Failed to load version info: ${response.status}`);
        }
        
        currentVersionInfo = await response.json();
        log('Loaded version info:', currentVersionInfo);
        return currentVersionInfo;
    } catch (error) {
        console.error('Error loading version info:', error);
        throw error;
    }
}

/**
 * Check for updates from the server
 */
async function checkForUpdates() {
    if (!currentVersionInfo || !currentVersionInfo.updateEndpoint) {
        log('No version info or update endpoint available');
        return;
    }
    
    try {
        log('Checking for updates...');
        
        // Add cache-busting parameter and device info
        const deviceInfo = getDeviceInfo();
        const url = `${currentVersionInfo.updateEndpoint}?v=${currentVersionInfo.version}&t=${Date.now()}&device=${deviceInfo}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Update check failed: ${response.status}`);
        }
        
        const remoteVersionInfo = await response.json();
        log('Remote version info:', remoteVersionInfo);
        
        // Compare versions and identify updates
        const updates = identifyUpdates(currentVersionInfo, remoteVersionInfo);
        
        if (updates.hasUpdates) {
            // Store update information
            storeUpdateInfo(updates);
            
            // Show notification to user
            showUpdateNotification(updates);
        } else {
            log('No updates available');
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

/**
 * Compare local and remote version information to identify updates
 */
function identifyUpdates(localVersion, remoteVersion) {
    const updates = {
        hasUpdates: false,
        newVersion: remoteVersion.version,
        currentVersion: localVersion.version,
        modules: {}
    };
    
    // Check if overall version has changed
    if (remoteVersion.version !== localVersion.version) {
        updates.hasUpdates = true;
    }
    
    // Check each module for updates
    for (const moduleKey in remoteVersion.modules) {
        const remoteModule = remoteVersion.modules[moduleKey];
        const localModule = localVersion.modules[moduleKey];
        
        // Skip if module doesn't exist locally
        if (!localModule) continue;
        
        // For simple modules with just version info
        if (typeof remoteModule === 'object' && remoteModule.version) {
            if (remoteModule.version !== localModule.version) {
                updates.modules[moduleKey] = {
                    hasUpdate: true,
                    currentVersion: localModule.version,
                    newVersion: remoteModule.version,
                    lastUpdated: remoteModule.lastUpdated
                };
                updates.hasUpdates = true;
            }
        }
        
        // For nested content modules
        if (moduleKey === 'content' && typeof remoteModule === 'object') {
            updates.modules.content = {};
            let hasContentUpdates = false;
            
            for (const contentKey in remoteModule) {
                const remoteContent = remoteModule[contentKey];
                const localContent = localModule[contentKey];
                
                if (localContent && remoteContent.version !== localContent.version) {
                    updates.modules.content[contentKey] = {
                        hasUpdate: true,
                        currentVersion: localContent.version,
                        newVersion: remoteContent.version,
                        lastUpdated: remoteContent.lastUpdated
                    };
                    hasContentUpdates = true;
                    updates.hasUpdates = true;
                }
            }
            
            if (!hasContentUpdates) {
                delete updates.modules.content;
            }
        }
    }
    
    return updates;
}

/**
 * Store update information in local storage
 */
function storeUpdateInfo(updates) {
    localStorage.setItem(UPDATE_STORAGE_KEY, JSON.stringify(updates));
    log('Stored update info:', updates);
}

/**
 * Retrieve stored update information
 */
function getStoredUpdateInfo() {
    const storedData = localStorage.getItem(UPDATE_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
}

/**
 * Show notification to user about available updates
 */
function showUpdateNotification(updates) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('update-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'update-notification';
        notification.className = 'update-notification';
        document.body.appendChild(notification);
    }
    
    // Create notification content
    notification.innerHTML = `
        <div class="update-notification-content">
            <h3 data-i18n="updates.new_available">New Updates Available</h3>
            <p data-i18n="updates.new_version">Version ${updates.newVersion} is available</p>
            <div class="update-actions">
                <button id="update-now" data-i18n="updates.update_now">Update Now</button>
                <button id="update-later" data-i18n="updates.update_later">Later</button>
            </div>
        </div>
    `;
    
    // Apply translations if language module is loaded
    if (typeof applyTranslations === 'function') {
        applyTranslations(notification);
    }
    
    // Show notification
    notification.classList.add('visible');
    
    // Add event listeners
    document.getElementById('update-now').addEventListener('click', () => {
        applyUpdates(updates);
        notification.classList.remove('visible');
    });
    
    document.getElementById('update-later').addEventListener('click', () => {
        notification.classList.remove('visible');
    });
    
    log('Showed update notification');
}

/**
 * Set up the update notification UI
 */
function setupUpdateNotificationUI() {
    // Add CSS for update notification
    const style = document.createElement('style');
    style.textContent = `
        .update-notification {
            position: fixed;
            bottom: -100px;
            left: 0;
            right: 0;
            background-color: var(--accent-color, #ff5a00);
            color: white;
            padding: 15px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: bottom 0.3s ease-in-out;
            text-align: center;
        }
        
        .update-notification.visible {
            bottom: 0;
        }
        
        .update-notification-content {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .update-actions {
            margin-top: 10px;
        }
        
        .update-actions button {
            background-color: white;
            color: var(--accent-color, #ff5a00);
            border: none;
            padding: 8px 16px;
            margin: 0 5px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .update-actions button:hover {
            background-color: #f0f0f0;
        }
        
        @media (max-width: 480px) {
            .update-notification {
                padding: 10px;
            }
            
            .update-actions button {
                padding: 6px 12px;
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Check if there are stored updates
    const storedUpdates = getStoredUpdateInfo();
    if (storedUpdates && storedUpdates.hasUpdates) {
        // Show notification for stored updates
        setTimeout(() => {
            showUpdateNotification(storedUpdates);
        }, 2000); // Delay to ensure page is loaded
    }
}

/**
 * Apply updates to the website
 */
async function applyUpdates(updates) {
    log('Applying updates:', updates);
    
    try {
        // Fetch the latest version.json
        const response = await fetch(VERSION_FILE + '?t=' + new Date().getTime(), { 
            cache: 'no-store' 
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch latest version info: ${response.status}`);
        }
        
        const latestVersionInfo = await response.json();
        
        // Update modules
        for (const moduleKey in updates.modules) {
            if (moduleKey === 'content') {
                // Handle content module updates
                for (const contentKey in updates.modules.content) {
                    await updateContentModule(contentKey, latestVersionInfo);
                }
            } else {
                // Handle other module updates
                await updateModule(moduleKey, latestVersionInfo);
            }
        }
        
        // Update current version info
        currentVersionInfo = latestVersionInfo;
        
        // Clear stored update info
        localStorage.removeItem(UPDATE_STORAGE_KEY);
        
        // Show success message
        showUpdateSuccessMessage();
        
        // Reload translations if language module was updated
        if (updates.modules.languages) {
            if (typeof loadLanguage === 'function' && typeof getPreferredLanguage === 'function') {
                loadLanguage(getPreferredLanguage());
            }
        }
        
        log('Updates applied successfully');
    } catch (error) {
        console.error('Error applying updates:', error);
        showUpdateErrorMessage(error);
    }
}

/**
 * Update a specific module
 */
async function updateModule(moduleKey, latestVersionInfo) {
    log(`Updating module: ${moduleKey}`);
    
    const moduleInfo = latestVersionInfo.modules[moduleKey];
    if (!moduleInfo || !moduleInfo.files) {
        log(`No file information for module: ${moduleKey}`);
        return;
    }
    
    // Update each file in the module
    for (const file of moduleInfo.files) {
        if (file.includes('*')) {
            // Handle wildcard pattern (e.g., icons/*)
            const basePath = file.replace('*', '');
            await updateDirectoryFiles(basePath);
        } else {
            // Update individual file
            await updateFile(file);
        }
    }
}

/**
 * Update a specific content module
 */
async function updateContentModule(contentKey, latestVersionInfo) {
    log(`Updating content module: ${contentKey}`);
    
    // For content modules, we need to update the corresponding section in the HTML
    // and any associated language files
    
    // Refresh the page content
    if (typeof loadLanguage === 'function' && typeof getPreferredLanguage === 'function') {
        loadLanguage(getPreferredLanguage());
    }
    
    // Update any module-specific files if needed
    // This would depend on how content modules are structured
}

/**
 * Update a specific file
 */
async function updateFile(filePath) {
    log(`Updating file: ${filePath}`);
    
    try {
        // Force reload the file by adding cache-busting parameter
        const response = await fetch(filePath + '?t=' + new Date().getTime(), { 
            cache: 'no-store' 
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update file ${filePath}: ${response.status}`);
        }
        
        // For CSS and JS files, we need to reload them
        if (filePath.endsWith('.css')) {
            reloadCSSFile(filePath);
        } else if (filePath.endsWith('.js')) {
            reloadJSFile(filePath);
        }
        
        log(`File updated: ${filePath}`);
    } catch (error) {
        console.error(`Error updating file ${filePath}:`, error);
    }
}

/**
 * Update all files in a directory
 */
async function updateDirectoryFiles(dirPath) {
    log(`Updating directory: ${dirPath}`);
    
    // This would require server-side support to list directory contents
    // For now, we'll just log that this would happen
    log(`Directory update would require server-side support: ${dirPath}`);
}

/**
 * Reload a CSS file
 */
function reloadCSSFile(filePath) {
    // Find the link element for this CSS file
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of links) {
        if (link.href.includes(filePath)) {
            // Create a new link element
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = filePath + '?t=' + new Date().getTime();
            
            // Add the new link and remove the old one
            link.parentNode.insertBefore(newLink, link.nextSibling);
            setTimeout(() => {
                link.parentNode.removeChild(link);
            }, 1000); // Give time for the new stylesheet to load
            
            break;
        }
    }
}

/**
 * Reload a JavaScript file
 */
function reloadJSFile(filePath) {
    // For JS files, we need to reload the page to apply changes
    // But we can mark that the file has been updated
    log(`JavaScript file updated: ${filePath} - Page reload required for full effect`);
}

/**
 * Show success message after updates are applied
 */
function showUpdateSuccessMessage() {
    // Create and show a success message
    const message = document.createElement('div');
    message.className = 'update-message success';
    message.innerHTML = `
        <div class="update-message-content">
            <h3 data-i18n="updates.success_title">Update Successful</h3>
            <p data-i18n="updates.success_message">The guide has been updated to the latest version.</p>
            <button class="close-message" data-i18n="updates.close">Close</button>
        </div>
    `;
    
    // Apply translations if language module is loaded
    if (typeof applyTranslations === 'function') {
        applyTranslations(message);
    }
    
    // Add to document
    document.body.appendChild(message);
    
    // Add CSS for message
    if (!document.getElementById('update-message-styles')) {
        const style = document.createElement('style');
        style.id = 'update-message-styles';
        style.textContent = `
            .update-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                z-index: 1001;
                max-width: 90%;
                width: 400px;
                text-align: center;
            }
            
            .update-message.success {
                border-top: 4px solid #4CAF50;
            }
            
            .update-message.error {
                border-top: 4px solid #F44336;
            }
            
            .close-message {
                background-color: var(--accent-color, #ff5a00);
                color: white;
                border: none;
                padding: 8px 16px;
                margin-top: 15px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            
            .update-message-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'update-message-overlay';
    document.body.appendChild(overlay);
    
    // Add close functionality
    const closeButton = message.querySelector('.close-message');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(message);
        document.body.removeChild(overlay);
    });
}

/**
 * Show error message if updates fail
 */
function showUpdateErrorMessage(error) {
    // Create and show an error message
    const message = document.createElement('div');
    message.className = 'update-message error';
    message.innerHTML = `
        <div class="update-message-content">
            <h3 data-i18n="updates.error_title">Update Failed</h3>
            <p data-i18n="updates.error_message">There was a problem updating the guide. Please try again later.</p>
            <p class="error-details">${error.message}</p>
            <button class="close-message" data-i18n="updates.close">Close</button>
        </div>
    `;
    
    // Apply translations if language module is loaded
    if (typeof applyTranslations === 'function') {
        applyTranslations(message);
    }
    
    // Add to document
    document.body.appendChild(message);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'update-message-overlay';
    document.body.appendChild(overlay);
    
    // Add close functionality
    const closeButton = message.querySelector('.close-message');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(message);
        document.body.removeChild(overlay);
    });
}

/**
 * Get device information for update requests
 */
function getDeviceInfo() {
    // Use the isRabbitR1 function if available
    if (typeof isRabbitR1 === 'function') {
        const isR1 = isRabbitR1();
        return isR1 ? 'rabbit-r1' : 'other';
    }
    
    // Fallback to basic detection
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('rabbit') || userAgent.includes('r1')) {
        return 'rabbit-r1';
    }
    
    return 'other';
}

/**
 * Debug logging function
 */
function log(...args) {
    if (DEBUG_MODE) {
        console.log('[Update System]', ...args);
    }
}

// Initialize when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUpdateMechanism);
} else {
    initUpdateMechanism();
}