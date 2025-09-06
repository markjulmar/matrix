# Matrix Screensaver

A Windows screensaver built from the Matrix digital rain web project using Electron.

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
   Or simply run `build.bat`

3. **Install as screensaver** (requires admin privileges):
   Run `install-screensaver.bat` as administrator

## Manual Installation

1. Build the application as described above
2. Copy `dist\win-unpacked\Matrix Screensaver.exe` to `C:\Windows\System32\MatrixScreensaver.scr`
3. Go to Windows Settings > Personalization > Lock screen > Screen saver settings
4. Select "MatrixScreensaver" from the dropdown

## Features

- **Multi-monitor support**: Works across all connected displays
- **Configuration panel**: Customize Matrix version, speed, columns, etc.
- **Preview mode**: Test settings before applying
- **Mouse/keyboard detection**: Automatically exits on user activity
- **All Matrix variants**: Classic, Operator, Resurrections, Nightmare, Paradise, 3D mode

## Usage

The screensaver supports standard Windows screensaver command line arguments:

- `/s` - Run as screensaver (fullscreen on all monitors)
- `/c` - Show configuration dialog
- `/p <hwnd>` - Preview mode (shows in small window)
- No args - Standalone mode for testing

## Configuration

The configuration panel allows you to customize:

- Matrix version (Classic, Operator, Resurrections, etc.)
- Number of columns (40-200)
- Fall speed (0.1-2.0)
- Animation speed (0.1-3.0)
- Glow strength (0.0-1.0)

Settings are saved automatically and applied when the screensaver runs.

## Troubleshooting

### Screensaver doesn't appear in Windows settings
- Make sure you ran `install-screensaver.bat` as administrator
- Check that `MatrixScreensaver.scr` exists in `C:\Windows\System32\`
- Try logging out and back in to refresh the screensaver list

### Performance issues
- Lower the number of columns in settings
- Reduce animation speed
- Ensure hardware acceleration is enabled in the system

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