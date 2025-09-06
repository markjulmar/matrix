@echo off
echo Building Matrix Screensaver...

:: Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

:: Build the application
echo Building Electron app...
npm run dist

:: Check if build was successful
if exist "dist\Matrix Screensaver Setup*.exe" (
    echo.
    echo Build successful! Installer created in dist\ folder
    echo.
    echo To install as screensaver:
    echo 1. Run the installer
    echo 2. Right-click desktop > Personalize > Lock screen > Screen saver settings
    echo 3. Select "Matrix Screensaver" from dropdown
    echo.
) else (
    echo Build failed! Check the output above for errors.
)

pause