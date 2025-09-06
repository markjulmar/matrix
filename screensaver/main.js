const { app, BrowserWindow, screen, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

let mainWindow;
let isFullscreen = false;
let currentEffect = 'classic';

// Available Matrix effects
const availableEffects = [
	'classic',
	'megacity', 
	'neomatrixology',
	'operator',
	'nightmare',
	'paradise',
	'resurrections',
	'trinity',
	'morpheus',
	'bugs',
	'palimpsest',
	'twilight',
	'holoplay',
	'3d'
];

// Handle command line arguments before app is ready
app.commandLine.appendSwitch('disable-web-security');

// Display help information
function showHelpText() {
  const helpText = `Matrix Digital Rain Screensaver

Usage: matrix.exe [options]

Options:
  /f, -f, --fullscreen     Run in fullscreen screensaver mode
  --effect <name>          Select Matrix effect (default: classic)
  /?, /h, --help          Show this help message

Available Effects:
  classic       The original Matrix effect
  megacity      Megacity-style glyphs
  neomatrixology Neomatrixology font variant
  operator      Operator-style interface
  nightmare     Dark gothic nightmare theme
  paradise      Bright paradise theme
  resurrections Matrix Resurrections movie style
  trinity       Trinity character theme
  morpheus      Morpheus character theme
  bugs          Agent Smith/bugs theme
  palimpsest    Ancient text overlay effect
  twilight      Sunset twilight colors
  holoplay      Holographic display mode
  3d            Volumetric 3D effect

Examples:
  matrix.exe                           # Windowed mode with classic effect
  matrix.exe --fullscreen              # Fullscreen screensaver with classic
  matrix.exe --effect nightmare        # Windowed mode with nightmare effect
  matrix.exe --fullscreen --effect trinity  # Fullscreen with trinity effect`;

  // For packaged apps, show help in a dialog since console isn't visible
  if (app.isPackaged) {
    dialog.showMessageBox({
      type: 'info',
      title: 'Matrix Screensaver Help',
      message: 'Matrix Digital Rain Screensaver',
      detail: helpText,
      buttons: ['OK']
    }).then(() => {
      app.quit();
    });
  } else {
    // In development, we can use console.log
    console.log(helpText);
    app.quit();
  }
}

// Parse command line arguments for app modes
function parseArgs() {
  // For packaged apps, arguments might be in different positions
  let args;
  if (app.isPackaged) {
    // In packaged app, skip electron.exe and the app path
    args = process.argv.slice(1);
  } else {
    // In development, skip node and script path
    args = process.argv.slice(2);
  }
  const result = { mode: 'windowed', effect: 'classic', showHelp: false };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i].toLowerCase();
    
    if (arg === '/?' || arg === '/h' || arg === '--help') {
      result.showHelp = true;
      return result; // Return immediately when help is requested
    } else if (arg === '/f' || arg === '-f' || arg === '--fullscreen') {
      result.mode = 'fullscreen';
    } else if (arg === '--effect' && i + 1 < args.length) {
      const effect = args[i + 1].toLowerCase();
      if (availableEffects.includes(effect)) {
        result.effect = effect;
        currentEffect = effect;
        i++; // Skip the next argument since we consumed it
      } else {
        console.log('Invalid effect specified:', effect);
        console.log('Available effects:', availableEffects.join(', '));
      }
    }
  }
  
  return result;
}

function createWindowedWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });
  
  // Create application menu
  createMenu();
  
  loadMatrixWithEffect(currentEffect);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function loadMatrixWithEffect(effect) {
  // Try to find index.html in current directory first (production), then parent directory (development)
  let indexPath = path.join(__dirname, 'index.html');
  if (!require('fs').existsSync(indexPath)) {
    indexPath = path.join(__dirname, '..', 'index.html');
  }
  const matrixUrl = `file://${indexPath}?version=${effect}&skipIntro=true&suppressWarnings=true`;
  console.log('Loading Matrix with URL:', matrixUrl);
  mainWindow.loadURL(matrixUrl);
}

function createMenu() {
  const effectMenuItems = availableEffects.map(effect => ({
    label: effect.charAt(0).toUpperCase() + effect.slice(1),
    type: 'radio',
    checked: effect === currentEffect,
    click: () => {
      currentEffect = effect;
      loadMatrixWithEffect(effect);
    }
  }));
  
  const template = [
    {
      label: 'Effect',
      submenu: effectMenuItems
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


function createFullscreenWindow() {
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
    // Try to find index.html in current directory first (production), then parent directory (development)
    let indexPath = path.join(__dirname, 'index.html');
    if (!require('fs').existsSync(indexPath)) {
      indexPath = path.join(__dirname, '..', 'index.html');
    }
    const matrixUrl = `file://${indexPath}?version=${currentEffect}&numColumns=120&fallSpeed=0.4&animationSpeed=0.8&skipIntro=true&suppressWarnings=true`;
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
      if (isFullscreen) {
        app.quit();
      }
    });

    win.on('blur', () => {
      if (isFullscreen) {
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
    if (!isFullscreen) return;

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

app.whenReady().then(() => {
  const { mode, effect, showHelp } = parseArgs();
  
  if (showHelp) {
    showHelpText();
    return;
  }
  
  currentEffect = effect;
  
  switch (mode) {
    case 'fullscreen':
      isFullscreen = true;
      createFullscreenWindow();
      break;
    default:
      createWindowedWindow();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});