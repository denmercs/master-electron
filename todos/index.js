const electron = require("electron");

const {app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on("closed", () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add New Todo",
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.loadURL( `file://${__dirname}/add.html`);
    addWindow.on('closed', () => {
        // pointing the add window to null, for garbage collection
        addWindow = null;
    });
};

ipcMain.on("todoAdd", (e, todo) => {
    mainWindow.webContents.send('todoAdd', todo);
    addWindow.close();
});

// menu template
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                click() {
                    createAddWindow();
                }
            },
            {
                label: "Clear",
                click() {
                    mainWindow.webContents.send('todoClear');
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// check if it's mac os add an empty object
if (process.platform === "darwin") {
    menuTemplate.unshift({});
}

// production, staging, development, test
if( process.env.NODE_ENV !== "production") {
    menuTemplate.push({
        label: "View",
        submenu: [
            {role: 'reload'},
            {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }]

    })    
}