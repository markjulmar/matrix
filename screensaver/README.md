# Matrix Screensaver app

A Windows app built from the Matrix digital rain web project using Electron.

## Building the Screensaver

### Prerequisites
- Node.js (https://nodejs.org/)
- Windows 10/11

### Build Steps

1. **Install dependencies**:
   ```bash
   cd screensaver
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run dist
   ```

## Features

- **Multi-monitor support**: Works across all connected displays
- **Mouse/keyboard detection**: Automatically exits on user activity

### Build errors
- Make sure Node.js is installed and updated
- Delete `node_modules` folder and run `npm install` again
- Check that you have sufficient disk space for the build

## Technical Details

This screensaver uses Electron to wrap the existing web-based Matrix effect. It:

- Loads the Matrix HTML/JS directly from the parent directory
- Creates fullscreen windows on all displays
- Monitors mouse movement and keyboard input for exit conditions
- Provides a native Windows configuration interface
- Packages as a standard Windows executable