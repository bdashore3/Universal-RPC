import DiscordRPC = require('discord-rpc');
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let rpc: DiscordRPC.Client;
let presence: DiscordRPC.Presence = { instance: false };

export interface RpcResult {
    success: boolean;
    error?: string;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

async function generateHandler(rpc: DiscordRPC.Client): Promise<void> {
    rpc.on('ready', () => {
        rpc.setActivity(presence);

        setInterval(() => {
            rpc.setActivity(presence);
        }, 15e3);
    });
}

async function registerId(clientId: string): Promise<RpcResult> {
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    DiscordRPC.register(clientId);
    await generateHandler(rpc);

    try {
        await rpc.login({ clientId });
    } catch (e) {
        console.error;
        return { success: false, error: e.message };
    }

    return { success: true };
}

function updatePresence(newPresence: DiscordRPC.Presence): void {
    presence = { ...presence, ...newPresence };
}

async function destroyRpc(): Promise<RpcResult> {
    try {
        await rpc.destroy();
    } catch (e) {
        return { success: false, error: e.message };
    }

    return { success: true };
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
    win.loadFile(path.join(__dirname, '../src/index.html'));
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
            win?.loadFile(path.join(__dirname, '../src/pagetwo.html'));
        }, 2.5e3);
    }
});

ipcMain.on('destroyRpc', async function (event) {
    const result = await destroyRpc();

    event.reply('asynchronous-reply', result);

    if (result.success) {
        presence = {};

        const win = BrowserWindow.getFocusedWindow();
        setTimeout(() => {
            setTimeout(function () {
                win?.loadFile(path.join(__dirname, '../src/index.html'));
            }, 4e3);
        });
    }
});

ipcMain.on('doUpdatePresence', function (event, newPresence) {
    updatePresence(newPresence);

    event.reply('asynchronous-reply', '');
});
