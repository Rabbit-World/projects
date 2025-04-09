# Rabbit R1 Guide Website - User Guide

This comprehensive guide explains how to deploy, access, and use the Rabbit R1 Guide website. The guide is specifically designed for the Rabbit R1 device's unique 2.88-inch screen and provides detailed information about the device's features and capabilities.

## Table of Contents
1. [Deploying the Website](#deploying-the-website)
2. [Accessing from a Rabbit R1 Device](#accessing-from-a-rabbit-r1-device)
3. [Language Switching Feature](#language-switching-feature)
4. [Update Mechanism](#update-mechanism)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Deploying the Website

### Option 1: Using a Web Server

1. **Download the latest release package**
   - Download the latest `rabbit-r1-guide-[version].zip` file from the releases page
   - Extract the ZIP file to a directory on your computer

2. **Upload to a web server**
   - Upload all extracted files to your web server using FTP or your hosting provider's file manager
   - Ensure you maintain the directory structure as provided in the ZIP file
   - Make sure the web server has proper permissions to serve all file types (HTML, CSS, JS, JSON, images)

3. **Configure your web server (if needed)**
   - Ensure your web server is configured to serve JSON files with the correct MIME type (`application/json`)
   - For Apache servers, this is typically handled automatically
   - For Nginx, you may need to add the following to your server configuration:
     ```
     types {
         application/json json;
     }
     ```

4. **Test the deployment**
   - Access the website through your domain to verify it loads correctly
   - Check that all resources (CSS, JavaScript, images) load without errors
   - Test the device detection by accessing from different devices

### Option 2: Using GitHub Pages

1. **Create a GitHub repository**
   - Create a new repository on GitHub
   - Upload all files from the ZIP package to the repository, maintaining the directory structure

2. **Enable GitHub Pages**
   - Go to the repository settings
   - Scroll down to the GitHub Pages section
   - Select the branch you want to deploy (usually `main` or `master`)
   - Click Save

3. **Access your deployed site**
   - GitHub will provide a URL for your deployed site (typically `https://[username].github.io/[repository-name]`)
   - The website will be automatically deployed whenever you push changes to the repository

### Option 3: Local Deployment for Testing

1. **Set up a local web server**
   - You can use tools like Python's built-in HTTP server:
     ```
     # Navigate to the directory containing the extracted files
     cd path/to/rabbit-r1-guide
     
     # Start a simple HTTP server (Python 3)
     python -m http.server 8000
     ```
   - Or use Node.js with a package like `http-server`:
     ```
     # Install http-server globally (if not already installed)
     npm install -g http-server
     
     # Navigate to the directory containing the extracted files
     cd path/to/rabbit-r1-guide
     
     # Start the server
     http-server -p 8000
     ```

2. **Access the local deployment**
   - Open a web browser and navigate to `http://localhost:8000`
   - The website should load and function as expected

## Accessing from a Rabbit R1 Device

The Rabbit R1 has limited web browsing capabilities, but you can access the guide website using the following methods:

### Method 1: Direct URL Access

1. On your Rabbit R1 device, activate the voice assistant by pressing and holding the Rabbit button
2. Say "Open website [your-website-url]" where [your-website-url] is the URL where you deployed the guide
3. The device should load the guide website, which is specifically optimized for the R1's 2.88-inch screen

### Method 2: QR Code Access

1. Generate a QR code for your deployed website URL using any QR code generator
2. On your Rabbit R1 device, activate the camera
3. Point the camera at the QR code
4. When prompted, confirm that you want to open the URL
5. The guide website should load on your device

### Device Detection

The website includes a device detection mechanism that automatically:
- Identifies when the site is being accessed from a Rabbit R1 device
- Applies specific optimizations for the 2.88-inch screen
- Adjusts the interface for optimal viewing on the device

If you access the website from a non-Rabbit R1 device, you'll see a notification that the site is optimized for the Rabbit R1, but you can still proceed to view the content.

## Language Switching Feature

The Rabbit R1 Guide website supports 14 languages to accommodate users worldwide:

### Supported Languages
- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Simplified Chinese
- Traditional Chinese
- Arabic
- Hindi
- Swedish

### How to Change Languages

1. **From the navigation menu**
   - Open the main menu (tap the menu icon in the top right)
   - Select "Language" from the navigation options
   - Choose your preferred language from the list
   - The interface will immediately update to display content in the selected language

2. **From the language settings section**
   - Scroll to or navigate to the "Language Settings" section of the website
   - Select your preferred language from the available options
   - Click/tap the "Apply" button to change the language

### Language Persistence

- Your language preference is saved in your browser's local storage
- The website will remember your language choice when you return
- You can change languages at any time using the methods described above

### Right-to-Left Language Support

For languages that read right-to-left (like Arabic), the interface automatically adjusts:
- Text alignment changes to right-to-left
- Navigation elements and UI components reposition appropriately
- The entire layout adapts to provide a natural reading experience

## Update Mechanism

The Rabbit R1 Guide website includes an automatic update mechanism to ensure you always have the latest content and features:

### How Updates Work

1. **Automatic Check**
   - The website automatically checks for updates once per day
   - This check compares your local version with the latest available version
   - The check is lightweight and uses minimal data

2. **Update Notification**
   - If an update is available, a notification appears at the bottom of the screen
   - The notification includes the version number and a brief description of what's new
   - You can choose to update immediately or postpone

3. **Applying Updates**
   - When you choose to update, the new content is downloaded in the background
   - Only changed files are downloaded to minimize data usage
   - Once downloaded, the page refreshes to apply the updates

### Manual Update Check

You can manually check for updates at any time:
1. Navigate to the "Updates" section of the website
2. Click/tap the "Check for Updates" button
3. The system will check for and apply any available updates

### Update Components

The update system can update different components independently:
- Content updates (text and information)
- Language file updates (translations)
- Feature updates (new functionality)
- Style updates (visual improvements)

### Offline Access After Updates

- After updating, the latest version of the guide is cached for offline access
- This ensures you can access the guide even without an internet connection
- Note that some dynamic features may still require internet connectivity

## Troubleshooting Common Issues

### Device Detection Issues

**Problem**: The website doesn't recognize your Rabbit R1 device correctly.

**Solutions**:
1. Ensure your device's browser is up to date
2. Clear your browser cache and cookies
3. Try accessing the site in a private/incognito browsing session
4. Use the "Continue Anyway" button on the restricted page to bypass detection
5. If problems persist, contact support with your device details

### Language Switching Problems

**Problem**: Language doesn't change or displays incorrectly.

**Solutions**:
1. Clear your browser's local storage:
   - Go to your browser settings
   - Find the storage or privacy section
   - Clear site data for the guide website
2. Reload the page completely (not from cache)
3. Try selecting a different language first, then switch to your desired language
4. Check your internet connection, as language files need to be downloaded

### Update Failures

**Problem**: Updates fail to download or apply.

**Solutions**:
1. Check your internet connection
2. Clear your browser cache
3. Try manually checking for updates again
4. If using a content blocker or firewall, ensure it's not blocking the update requests
5. As a last resort, try accessing the website from a fresh browser session

### Display and Layout Issues

**Problem**: Content appears cut off or incorrectly formatted.

**Solutions**:
1. Ensure your device is in the correct orientation (portrait mode works best)
2. Check that your display zoom settings are at the default level
3. Try refreshing the page
4. Clear your browser cache to ensure you have the latest CSS files
5. If using a custom browser, try the device's default browser instead

### Offline Access Issues

**Problem**: Cannot access the guide when offline.

**Solutions**:
1. Ensure you've visited the site at least once while online
2. Make sure you're accessing the exact same URL as when online
3. Check if your browser supports offline caching
4. Try navigating to different sections of the guide that you've previously visited
5. If problems persist, access the site online once more to refresh the cache

### Contact Support

If you encounter persistent issues not covered in this troubleshooting guide, please contact support with the following information:
- Your Rabbit R1 device details (if applicable)
- Browser and version you're using
- Specific error messages or screenshots
- Steps you've already taken to resolve the issue

Support can be reached at [support@rabbitr1guide.com](mailto:support@rabbitr1guide.com) or through the contact form on the website.