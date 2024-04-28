import { io } from "socket.io-client";

export const socket = io(
    getSocketUrl()
);

function getSocketUrl(): string {
    if (process.env.NEXT_PUBLIC_GITPOD_WORKSPACE_URL) {
        let workspaceUrl = process.env.NEXT_PUBLIC_GITPOD_WORKSPACE_URL;
        workspaceUrl = workspaceUrl.slice(8);
        return 'https://3001-' + workspaceUrl;
    }

    return process.env.NEXT_PUBLIC_SOCKET_SERVER ?? 'https://root.nighttech.de';
}
