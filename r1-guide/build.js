/**
 * Rabbit R1 Guide - Build Script
 * 
 * This script packages the Rabbit R1 Guide website for deployment.
 * It performs the following tasks:
 * 1. Creates a clean build directory
 * 2. Copies all necessary files
 * 3. Minifies CSS and JavaScript files
 * 4. Optimizes images
 * 5. Updates version information
 * 6. Creates a deployable ZIP package
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuration
const BUILD_DIR = 'build';
const DIST_DIR = 'dist';
const VERSION_FILE = 'version.json';
const PACKAGE_NAME = 'rabbit-r1-guide';

// Files and directories to include in the build
const INCLUDE_FILES = [
    'index.html',
    'main.js',
    'styles.css',
    'detect.js',
    'checkForUpdates.js',
    'version.json',
    'favicon.ico',
    'r1_device.png',
    'README.md',
    'test.html'
];

const INCLUDE_DIRS = [
    'lang',
    'icons'
];

// Files to minify
const JS_FILES = [
    'main.js',
    'detect.js',
    'checkForUpdates.js'
];

const CSS_FILES = [
    'styles.css'
];

/**
 * Main build function
 */
async function build() {
    try {
        console.log('Starting build process...');
        
        // Create build directory
        await createBuildDir();
        
        // Copy files and directories
        await copyFilesAndDirs();
        
        // Minify JS and CSS files
        await minifyFiles();
        
        // Optimize images
        await optimizeImages();
        
        // Update version information
        await updateVersionInfo();
        
        // Create distribution package
        await createDistPackage();
        
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

/**
 * Create clean build directory
 */
async function createBuildDir() {
    console.log('Creating build directory...');
    
    // Remove existing build directory if it exists
    if (fs.existsSync(BUILD_DIR)) {
        await execPromise(`rm -rf ${BUILD_DIR}`);
    }
    
    // Create new build directory
    fs.mkdirSync(BUILD_DIR);
    
    console.log('Build directory created.');
}

/**
 * Copy files and directories to build directory
 */
async function copyFilesAndDirs() {
    console.log('Copying files and directories...');
    
    // Copy individual files
    for (const file of INCLUDE_FILES) {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(BUILD_DIR, file));
            console.log(`Copied: ${file}`);
        } else {
            console.warn(`Warning: File not found: ${file}`);
        }
    }
    
    // Copy directories
    for (const dir of INCLUDE_DIRS) {
        if (fs.existsSync(dir)) {
            await execPromise(`cp -r ${dir} ${BUILD_DIR}/`);
            console.log(`Copied directory: ${dir}`);
        } else {
            console.warn(`Warning: Directory not found: ${dir}`);
        }
    }
    
    console.log('Files and directories copied.');
}

/**
 * Minify JS and CSS files
 */
async function minifyFiles() {
    console.log('Minifying files...');
    
    try {
        // Check if terser is installed for JS minification
        await execPromise('which terser');
        
        // Minify JS files
        for (const file of JS_FILES) {
            const inputPath = path.join(BUILD_DIR, file);
            const outputPath = inputPath; // Overwrite the original file
            
            await execPromise(`terser ${inputPath} -o ${outputPath} --compress --mangle`);
            console.log(`Minified JS: ${file}`);
        }
    } catch (error) {
        console.warn('Warning: terser not installed. Skipping JS minification.');
        console.warn('To install: npm install -g terser');
    }
    
    try {
        // Check if csso is installed for CSS minification
        await execPromise('which csso');
        
        // Minify CSS files
        for (const file of CSS_FILES) {
            const inputPath = path.join(BUILD_DIR, file);
            const outputPath = inputPath; // Overwrite the original file
            
            await execPromise(`csso ${inputPath} -o ${outputPath}`);
            console.log(`Minified CSS: ${file}`);
        }
    } catch (error) {
        console.warn('Warning: csso not installed. Skipping CSS minification.');
        console.warn('To install: npm install -g csso-cli');
    }
    
    console.log('File minification completed.');
}

/**
 * Optimize images
 */
async function optimizeImages() {
    console.log('Optimizing images...');
    
    try {
        // Check if imagemin is installed
        await execPromise('which imagemin');
        
        // Find all image files in the build directory
        const findImagesCmd = `find ${BUILD_DIR} -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" \\)`;
        const { stdout } = await execPromise(findImagesCmd);
        
        const imageFiles = stdout.trim().split('\n').filter(Boolean);
        
        // Optimize each image
        for (const imagePath of imageFiles) {
            await execPromise(`imagemin ${imagePath} --out-dir=$(dirname ${imagePath})`);
            console.log(`Optimized: ${imagePath}`);
        }
    } catch (error) {
        console.warn('Warning: imagemin not installed. Skipping image optimization.');
        console.warn('To install: npm install -g imagemin-cli');
    }
    
    console.log('Image optimization completed.');
}

/**
 * Update version information
 */
async function updateVersionInfo() {
    console.log('Updating version information...');
    
    const versionFilePath = path.join(BUILD_DIR, VERSION_FILE);
    
    if (fs.existsSync(versionFilePath)) {
        // Read the version file
        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        
        // Update the lastUpdated timestamp
        versionData.lastUpdated = new Date().toISOString();
        
        // Write the updated version file
        fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
        
        console.log(`Version information updated: ${versionData.version}`);
    } else {
        console.warn(`Warning: Version file not found: ${VERSION_FILE}`);
    }
}

/**
 * Create distribution package
 */
async function createDistPackage() {
    console.log('Creating distribution package...');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR);
    }
    
    // Read version information
    let version = 'latest';
    const versionFilePath = path.join(BUILD_DIR, VERSION_FILE);
    
    if (fs.existsSync(versionFilePath)) {
        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        version = versionData.version;
    }
    
    // Create ZIP package
    const packageFileName = `${PACKAGE_NAME}-${version}.zip`;
    const packageFilePath = path.join(DIST_DIR, packageFileName);
    
    await execPromise(`cd ${BUILD_DIR} && zip -r ../${packageFilePath} .`);
    
    console.log(`Distribution package created: ${packageFilePath}`);
}

// Run the build process
build();