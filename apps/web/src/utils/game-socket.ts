import { io } from "socket.io-client";

const socketUrl = getSocketUrl();

export const socket = io(socketUrl, {
  transports: ["websocket"],
});

function getSocketUrl(): string {
  if (!process.env.NEXT_PUBLIC_SOCKET_SERVER) {
    throw new Error("NEXT_PUBLIC_SOCKET_SERVER is not defined");
  }
  return process.env.NEXT_PUBLIC_SOCKET_SERVER as string;
}
