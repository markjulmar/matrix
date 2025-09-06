const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;
let configWindow;
let isScreensaver = false;

// Parse command line arguments for screensaver modes
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    return { mode: 'standalone' };
  }
  
  const arg = args[0].toLowerCase();
  
  if (arg === '/s' || arg === '-s') {
    return { mode: 'screensaver' };
  } else if (arg === '/c' || arg === '-c') {
    return { mode: 'config' };
  } else if (arg.startsWith('/p') || arg.startsWith('-p')) {
    // Preview mode with window handle (not fully supported in Electron)
    return { mode: 'preview', handle: arg.substring(2) };
  }
  
  return { mode: 'standalone' };
}

function createScreensaverWindow() {
  const displays = screen.getAllDisplays();
  
  displays.forEach((display, index) => {
    const { x, y, width, height } = display.bounds;
    
    const win = new BrowserWindow({
      x: x,
      y: y,
      width: width,
      height: height,
      fullscreen: true,
      frame: false,
      show: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      kiosk: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: false // Needed for local file access
      }
    });
    
    // Load the Matrix effect with screensaver-appropriate settings
    const matrixUrl = `file://${path.join(__dirname, '..', 'index.html')}?numColumns=120&fallSpeed=0.4&animationSpeed=0.8&skipIntro=true&suppressWarnings=true`;
    win.loadURL(matrixUrl);
    
    // Hide cursor
    win.webContents.on('dom-ready', () => {
      win.webContents.insertCSS('* { cursor: none !important; }');
    });
    
    win.once('ready-to-show', () => {
      win.show();
    });
    
    // Exit on any mouse movement or key press
    win.webContents.on('before-input-event', (event, input) => {
      if (isScreensaver) {
        app.quit();
      }
    });
    
    win.on('blur', () => {
      if (isScreensaver) {
        app.quit();
      }
    });
    
    // Store reference to main window
    if (index === 0) {
      mainWindow = win;
    }
  });
  
  // Track mouse movement to exit screensaver
  let lastMousePos = screen.getCursorScreenPoint();
  const mouseTimer = setInterval(() => {
    if (!isScreensaver) return;
    
    const currentPos = screen.getCursorScreenPoint();
    if (Math.abs(currentPos.x - lastMousePos.x) > 5 || Math.abs(currentPos.y - lastMousePos.y) > 5) {
      app.quit();
    }
    lastMousePos = currentPos;
  }, 100);
  
  app.on('before-quit', () => {
    clearInterval(mouseTimer);
  });
}

function createConfigWindow() {
  configWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  configWindow.loadFile(path.join(__dirname, 'config.html'));
  
  configWindow.on('closed', () => {
    configWindow = null;
    app.quit();
  });
}

function createStandaloneWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });
  
  const matrixUrl = `file://${path.join(__dirname, '..', 'index.html')}`;
  mainWindow.loadURL(matrixUrl);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const { mode } = parseArgs();
  
  switch (mode) {
    case 'screensaver':
      isScreensaver = true;
      createScreensaverWindow();
      break;
    case 'config':
      createConfigWindow();
      break;
    case 'preview':
      // Preview mode not fully supported - show small window instead
      createStandaloneWindow();
      if (mainWindow) {
        mainWindow.setSize(400, 300);
      }
      break;
    default:
      createStandaloneWindow();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

// Handle configuration changes
ipcMain.handle('save-config', async (event, config) => {
  // Save configuration to registry or file
  // For now, just show a message
  dialog.showMessageBox(configWindow, {
    type: 'info',
    title: 'Configuration Saved',
    message: 'Matrix screensaver settings have been saved.'
  });
});