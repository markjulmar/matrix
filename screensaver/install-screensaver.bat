@echo off
echo Matrix Screensaver Installation Helper
echo.

:: Check if running as administrator
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

:: Find the built executable
set "EXE_PATH="
if exist "dist\win-unpacked\Matrix Screensaver.exe" (
    set "EXE_PATH=%CD%\dist\win-unpacked\Matrix Screensaver.exe"
) else (
    echo Matrix Screensaver.exe not found in dist\win-unpacked\
    echo Please run build.bat first to build the application
    pause
    exit /b 1
)

:: Copy to System32 as .scr file (traditional screensaver location)
set "SCR_PATH=%SystemRoot%\System32\MatrixScreensaver.scr"
echo Copying screensaver to: %SCR_PATH%
copy "%EXE_PATH%" "%SCR_PATH%" >nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Screensaver installed successfully!
    echo.
    echo To activate:
    echo 1. Right-click desktop and select "Personalize"
    echo 2. Go to Lock screen ^> Screen saver settings
    echo 3. Select "MatrixScreensaver" from the dropdown
    echo 4. Click "Settings" to configure options
    echo 5. Click "Apply" or "OK"
    echo.
    echo The screensaver is now available in Windows settings.
) else (
    echo Failed to copy screensaver file.
    echo Make sure you're running as administrator.
)

pause