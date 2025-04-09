# Rabbit R1 Guide Website - Project Structure

## Directory Structure

```
rabbit-r1-guide/
├── css/
│   ├── styles.css           # Main stylesheet for the website
│   └── restricted.css       # Stylesheet for the restricted access page
├── js/
│   ├── main.js              # Core JavaScript functionality
│   ├── detect.js            # Rabbit R1 device detection script
│   └── checkForUpdates.js   # Update mechanism script
├── lang/                    # Language files for internationalization
│   ├── en.json              # English language
│   ├── es.json              # Spanish language
│   ├── fr.json              # French language
│   ├── de.json              # German language
│   ├── it.json              # Italian language
│   ├── pt.json              # Portuguese language
│   ├── ru.json              # Russian language
│   ├── ja.json              # Japanese language
│   ├── ko.json              # Korean language
│   ├── zh-CN.json           # Simplified Chinese language
│   ├── zh-TW.json           # Traditional Chinese language
│   ├── ar.json              # Arabic language
│   ├── hi.json              # Hindi language
│   └── sv.json              # Swedish language
├── images/
│   ├── r1_device.png        # Main Rabbit R1 device image
│   └── favicon.ico          # Website favicon
├── icons/                   # Navigation and feature icons
│   ├── home.png             # Home section icon
│   ├── getting_started.png  # Getting Started section icon
│   ├── features.png         # Features section icon
│   ├── ai_assistant.png     # AI Assistant feature icon
│   ├── rabbit_hole.png      # Rabbit Hole feature icon
│   ├── camera.png           # Camera feature icon
│   ├── voice.png            # Voice Commands feature icon
│   ├── translation.png      # Translation feature icon
│   ├── music.png            # Music feature icon
│   ├── specs.png            # Tech Specs section icon
│   ├── language.png         # Language section icon
│   ├── troubleshooting.png  # Troubleshooting section icon
│   ├── faq.png              # FAQ section icon
│   └── updates.png          # Updates section icon
├── index.html               # Main website entry point
├── landing.html             # Landing page with project overview
├── restricted.html          # Page shown to non-Rabbit R1 devices
├── test.html                # Test page for verifying functionality
├── build.js                 # Build script for creating distribution package
├── README.md                # Project documentation
├── USER_GUIDE.md            # Comprehensive user guide
├── project_structure.md     # This file - explains project structure
├── CHANGELOG.md             # Version history and changes
├── VERSION.txt              # Current version number and release date
└── sitemap.md               # Website content structure
```

## File Descriptions

### HTML Files
- **index.html**: The main website that serves as the comprehensive guide for Rabbit R1 users.
- **landing.html**: A simple entry point with project overview and quick start instructions.
- **restricted.html**: Displayed when a non-Rabbit R1 device accesses the website.
- **test.html**: Used for testing all components and functionality.

### CSS Files
- **styles.css**: Main stylesheet containing all styles for the website, including responsive design for the Rabbit R1's 2.88-inch screen.
- **restricted.css**: Styles specific to the restricted access page.

### JavaScript Files
- **main.js**: Core functionality including navigation, language switching, and UI interactions.
- **detect.js**: Script for detecting Rabbit R1 devices and applying device-specific optimizations.
- **checkForUpdates.js**: Handles checking for and applying updates to the guide content.
- **build.js**: Node.js script for building the distribution package.

### Language Files
The `lang/` directory contains JSON files for each supported language. Each file follows the same structure with translated strings for all UI elements and content. The website supports 14 languages:
- English (en.json)
- Spanish (es.json)
- French (fr.json)
- German (de.json)
- Italian (it.json)
- Portuguese (pt.json)
- Russian (ru.json)
- Japanese (ja.json)
- Korean (ko.json)
- Simplified Chinese (zh-CN.json)
- Traditional Chinese (zh-TW.json)
- Arabic (ar.json)
- Hindi (hi.json)
- Swedish (sv.json)

### Documentation Files
- **README.md**: Overview of the project, installation instructions, and general information.
- **USER_GUIDE.md**: Comprehensive guide for users explaining how to deploy, access, and use the website.
- **project_structure.md**: This file - explains the directory structure and file purposes.
- **CHANGELOG.md**: Documents version history and changes made in each release.
- **VERSION.txt**: Contains the current version number and release date.
- **sitemap.md**: Outlines the content structure of the website.

### Images and Icons
- **images/**: Contains the main device image and favicon.
- **icons/**: Contains icons used throughout the website for navigation and feature illustrations.

## Build and Deployment

The project uses a custom build script (`build.js`) to create a distribution package:
1. It organizes files into the appropriate directory structure
2. Minifies CSS and JavaScript files
3. Optimizes images
4. Creates a versioned ZIP file for distribution

To build the project:
```
node build.js
```

This will create a `dist/` directory with the organized files and a ZIP package named `rabbit-r1-guide-[version].zip`.