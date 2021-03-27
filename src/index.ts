import { app, BrowserWindow, ipcMain } from 'electron';
import { writeFile } from 'fs';
import * as path from 'path';
import { destroyClient, getClientId, registerClient, updatePresence } from './rpc';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

function createWindow(): void {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, 'html/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('register', async function (event, value) {
    const clientId: string = value;

    const result = await registerClient(clientId);

    event.reply('asynchronous-reply', result);

    if (result.success) {
        const win = BrowserWindow.getFocusedWindow();
        setTimeout(function () {
            win?.loadFile(path.join(__dirname, 'html/pagetwo.html'));
        }, 2.5e3);
    }
});

ipcMain.on('destroy', async function (event) {
    const result = await destroyClient();

    event.reply('asynchronous-reply', result);

    if (result.success) {
        const win = BrowserWindow.getFocusedWindow();
        setTimeout(() => {
            setTimeout(function () {
                win?.loadFile(path.join(__dirname, 'html/index.html'));
            }, 4e3);
        });
    }
});

ipcMain.on('updatePresence', function (event, newPresence) {
    updatePresence(newPresence);
    event.reply('asynchronous-reply');
});

ipcMain.on('saveConfig', function (event, newPresence) {
    newPresence['clientId'] = getClientId();

    if (newPresence['startTimestamp'] !== null) {
        newPresence['startTimestamp'] = true;
    }

    if (newPresence.buttons.length === 0) {
        delete newPresence['buttons'];
    }

    const newPresenceJson = JSON.stringify(newPresence, null, 2);

    writeFile('configs/config.json', newPresenceJson, { flag: 'w' }, (err) => {
        if (err) {
            console.log(err.message);
        }
    });
});
