import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { registerId, destroyRpc, updatePresence } from './rpc';

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

ipcMain.on('clientId:value', async function (event, value) {
    const clientId: string = value;

    const result = await registerId(clientId);

    event.reply('asynchronous-reply', result);

    if (result.success) {
        const win = BrowserWindow.getFocusedWindow();
        setTimeout(function () {
            win?.loadFile(path.join(__dirname, 'html/pagetwo.html'));
        }, 2.5e3);
    }
});

ipcMain.on('destroyRpc', async function (event) {
    const result = await destroyRpc();

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

ipcMain.on('doUpdatePresence', function (event, newPresence) {
    updatePresence(newPresence);

    event.reply('asynchronous-reply', '');
});
