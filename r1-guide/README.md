# Rabbit R1 Guide Website

A comprehensive guide website for the Rabbit R1 device, featuring modular content, multilingual support, and an automatic update mechanism.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)
- [Content Management](#content-management)
  - [Adding New Content](#adding-new-content)
  - [Updating Existing Content](#updating-existing-content)
  - [Content Versioning](#content-versioning)
- [Language Support](#language-support)
  - [Adding New Languages](#adding-new-languages)
  - [Language File Structure](#language-file-structure)
- [Update Mechanism](#update-mechanism)
  - [How Updates Work](#how-updates-work)
  - [Update Server Configuration](#update-server-configuration)
- [Testing](#testing)
- [Device Detection](#device-detection)
- [Performance Optimizations](#performance-optimizations)
- [Troubleshooting](#troubleshooting)

## Overview

The Rabbit R1 Guide Website provides users with comprehensive information about using their Rabbit R1 device. The website is designed to be lightweight, responsive, and optimized specifically for the Rabbit R1's 2.88-inch touchscreen display, while also being accessible on other devices.

## Features

- **Device-Optimized Interface**: Automatically detects the Rabbit R1 device and optimizes the UI accordingly
- **Multilingual Support**: Includes 14 languages with easy addition of new translations
- **Modular Content Structure**: Content is organized into independent modules for easy updates
- **Automatic Update Mechanism**: Checks for and applies content updates without requiring a full site reload
- **Responsive Design**: Works on the Rabbit R1 device as well as desktop and mobile browsers
- **Dark Mode Support**: Automatically adapts to system preferences or user selection
- **Offline Capability**: Core content works without an internet connection
- **Testing Tools**: Includes comprehensive testing utilities

## File Structure

```
rabbit-r1-guide/
├── index.html              # Main HTML file
├── main.js                 # Core JavaScript functionality
├── styles.css              # Main stylesheet
├── detect.js               # Device detection script
├── checkForUpdates.js      # Update mechanism
├── version.json            # Version tracking information
├── test.html               # Testing utilities
├── README.md               # Documentation
├── build.js                # Build script
├── favicon.ico             # Site favicon
├── r1_device.png           # Device image
├── lang/                   # Language files
│   ├── en.json             # English (default)
│   ├── es.json             # Spanish
│   ├── fr.json             # French
│   ├── de.json             # German
│   ├── it.json             # Italian
│   ├── pt.json             # Portuguese
│   ├── ru.json             # Russian
│   ├── ja.json             # Japanese
│   ├── ko.json             # Korean
│   ├── zh-CN.json          # Simplified Chinese
│   ├── zh-TW.json          # Traditional Chinese
│   ├── ar.json             # Arabic
│   ├── hi.json             # Hindi
│   └── sv.json             # Swedish
└── icons/                  # UI icons and images
    └── [icon files]
```

## Setup and Installation

### Prerequisites

- Web server (Apache, Nginx, etc.) or static hosting service
- Node.js (v14+) for running the build script (optional)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rabbit-r1-guide.git
   cd rabbit-r1-guide
   ```

2. For local development, you can use any simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Access the site at `http://localhost:8000` or the port specified by your server

### Development Tools (Optional)

For minification and optimization during development:

```bash
# Install terser for JS minification
npm install -g terser

# Install csso for CSS minification
npm install -g csso-cli

# Install imagemin for image optimization
npm install -g imagemin-cli
```

## Deployment

### Building for Production

1. Run the build script to create an optimized production build:
   ```bash
   node build.js
   ```

2. The optimized files will be placed in the `build/` directory and a ZIP package will be created in the `dist/` directory.

### Manual Deployment

1. Copy all files to your web server's public directory
2. Ensure the server is configured to serve the correct MIME types
3. For optimal performance, configure your server to:
   - Enable gzip/Brotli compression
   - Set appropriate cache headers
   - Enable HTTP/2 if available

### Deployment on Static Hosting Services

The site can be deployed on any static hosting service like GitHub Pages, Netlify, Vercel, or AWS S3:

1. Upload the contents of the `build/` directory to your hosting service
2. Configure any custom domain settings if needed
3. Ensure HTTPS is enabled for secure content delivery

## Content Management

### Adding New Content

1. Identify the appropriate section in `index.html` where the content should be added
2. Add the HTML structure with appropriate `data-i18n` attributes for translatable text
3. Add corresponding entries to all language files in the `lang/` directory
4. Update the `version.json` file to increment the version number for the affected content module

Example of adding a new FAQ item:

```html
<!-- In index.html -->
<div class="faq-item">
    <h4 data-i18n="faq.new_question">How do I reset my Rabbit R1?</h4>
    <div class="faq-answer">
        <p data-i18n="faq.new_answer">To reset your Rabbit R1, press and hold the power button for 10 seconds.</p>
    </div>
</div>
```

```json
// In each language file (e.g., en.json)
{
    "faq": {
        "new_question": "How do I reset my Rabbit R1?",
        "new_answer": "To reset your Rabbit R1, press and hold the power button for 10 seconds."
    }
}
```

### Updating Existing Content

1. Locate the content to be updated in `index.html`
2. Make the necessary changes, ensuring all `data-i18n` attributes are preserved
3. Update the corresponding entries in all language files
4. Update the `version.json` file to increment the version number for the affected content module

### Content Versioning

The `version.json` file tracks the version of each content module:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-04-09T20:53:11Z",
  "modules": {
    "core": {
      "version": "1.0.0",
      "lastUpdated": "2025-04-09T20:53:11Z",
      "files": ["index.html", "main.js", "styles.css", "detect.js"]
    },
    "content": {
      "home": {
        "version": "1.0.0",
        "lastUpdated": "2025-04-09T20:53:11Z"
      },
      "getting-started": {
        "version": "1.0.0",
        "lastUpdated": "2025-04-09T20:53:11Z"
      }
    }
  }
}
```

When updating content:

1. Increment the version number for the specific module
2. Update the `lastUpdated` timestamp
3. If necessary, update the overall `version` number at the root level

## Language Support

### Adding New Languages

1. Create a new JSON file in the `lang/` directory using the appropriate language code (e.g., `nl.json` for Dutch)
2. Copy the structure from `en.json` and translate all values (keep the keys unchanged)
3. Add the language to the language selector in `index.html`:

```html
<select id="language-selector">
    <option value="en">English</option>
    <!-- Add your new language here -->
    <option value="nl">Nederlands</option>
</select>
```

4. Update the `version.json` file to include the new language file in the `languages` module

### Language File Structure

Language files follow a nested JSON structure that mirrors the `data-i18n` attributes in the HTML:

```json
{
  "header": {
    "title": "Rabbit R1 Guide",
    "menu": "Menu"
  },
  "navigation": {
    "home": "Home",
    "getting_started": "Getting Started",
    "core_features": "Core Features"
  }
}
```

The `data-i18n` attributes in the HTML should match the dot-notation path to the translation:

```html
<h1 data-i18n="header.title">Rabbit R1 Guide</h1>
```

## Update Mechanism

### How Updates Work

The update mechanism works as follows:

1. The `checkForUpdates.js` script periodically checks for updates by comparing the local `version.json` with the remote version
2. If updates are available, a notification is shown to the user
3. When the user chooses to update, the system:
   - Downloads the updated files
   - Applies the changes to the appropriate modules
   - Updates the local version information
   - Notifies the user of successful update

### Update Server Configuration

To set up an update server:

1. Host the latest version of all files on your server
2. Ensure the `version.json` file is updated with the correct version numbers and timestamps
3. Configure the `updateEndpoint` in `version.json` to point to your update server:

```json
{
  "updateEndpoint": "https://your-update-server.com/rabbit-r1-guide/updates"
}
```

4. The update server should respond to requests with the current `version.json` file

## Testing

The `test.html` file provides a comprehensive testing suite for the website:

1. Open `test.html` in a browser
2. Click "Run All Tests" to test all functionality
3. Individual tests can be run separately by clicking their respective "Run Test" buttons

The test suite checks:
- Device detection
- Language switching
- Update mechanism
- Content loading
- Navigation functionality

## Device Detection

The `detect.js` script handles device detection with the following features:

- Detects the Rabbit R1 device based on screen dimensions, user agent, and other characteristics
- Calculates a confidence score for the detection
- Applies device-specific optimizations
- Provides an override mechanism for testing

To test on non-Rabbit R1 devices, add `?device=r1` to the URL to simulate the Rabbit R1 device.

## Performance Optimizations

The website includes several performance optimizations for the Rabbit R1 device:

1. **Minimal Dependencies**: No external frameworks or large libraries
2. **Optimized Images**: Images are sized appropriately for the R1's display
3. **Lazy Loading**: Content is loaded on demand to reduce initial load time
4. **CSS Optimizations**: Styles are optimized for the R1's screen size
5. **JavaScript Efficiency**: Code is structured to minimize processing on the device

## Troubleshooting

### Common Issues

1. **Content Not Updating**:
   - Check if the `version.json` file is properly configured
   - Verify that the update server is accessible
   - Clear the browser cache

2. **Language Not Loading**:
   - Ensure the language file exists in the `lang/` directory
   - Check for JSON syntax errors in the language file
   - Verify that all required translation keys are present

3. **Display Issues on Rabbit R1**:
   - Verify that the device detection is working correctly
   - Check if the viewport settings are appropriate for the device
   - Ensure CSS media queries are correctly targeting the device dimensions

### Debug Mode

To enable debug mode for troubleshooting:

1. Open the browser console
2. Set `localStorage.setItem('debug_mode', 'true')`
3. Reload the page

Debug mode will provide additional logging information in the console.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Rabbit Inc. for creating the innovative R1 device
- Contributors to the multilingual translations
- The open source community for inspiration and tools