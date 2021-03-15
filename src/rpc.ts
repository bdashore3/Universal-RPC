import DiscordRPC = require('discord-rpc');

let rpc: DiscordRPC.Client;
let presence: DiscordRPC.Presence = { instance: false };

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

export async function registerId(clientId: string): Promise<RpcResult> {
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    DiscordRPC.register(clientId);
    await generateHandler(rpc);

    try {
        await rpc.login({ clientId });
    } catch (e) {
        console.error;
        return { success: false, error: e.message };
    }

    presence = { instance: false };
    return { success: true };
}

export function updatePresence(newPresence: DiscordRPC.Presence): void {
    presence = { ...presence, ...newPresence };
}

export async function destroyRpc(): Promise<RpcResult> {
    try {
        await rpc.destroy();
    } catch (e) {
        return { success: false, error: e.message };
    }

    return { success: true };
}
