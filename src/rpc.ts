import * as DiscordRPC from 'discord-rpc';
import { readFile } from 'fs';

let rpc: DiscordRPC.Client;
let presence: DiscordRPC.Presence = { instance: false };
let clientId: string;

export interface RpcResult {
    success: boolean;
    error?: string;
}

async function generateHandler(rpc: DiscordRPC.Client): Promise<void> {
    rpc.on('ready', () => {
        rpc.setActivity(presence);

        setInterval(() => {
            rpc.setActivity(presence);
        }, 15e3);
    });
}

export function getClientId(): string {
    return clientId;
}

export async function registerClient(_clientId: string): Promise<RpcResult> {
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    DiscordRPC.register(_clientId);
    await generateHandler(rpc);

    try {
        await rpc.login({ clientId: _clientId });
    } catch (e) {
        console.error;
        return { success: false, error: e.message };
    }

    clientId = _clientId;
    presence = { instance: false };
    return { success: true };
}

export async function loadRpcJson(): Promise<void> {
    readFile('configs/test.json', 'utf8', async (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('JSON successful!');

            const newPresence: Record<string, unknown> = JSON.parse(data);

            await registerClient(newPresence.clientId as string);
            delete newPresence['clientId'];

            updatePresence(newPresence);
        }
    });
}

export function updatePresence(newPresence: DiscordRPC.Presence): void {
    presence = { ...presence, ...newPresence };

    if (presence.buttons && presence.buttons.length === 0) {
        delete presence['buttons'];
    }
}

export async function destroyClient(): Promise<RpcResult> {
    try {
        await rpc.destroy();
    } catch (e) {
        return { success: false, error: e.message };
    }

    return { success: true };
}
