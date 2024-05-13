import { io } from "socket.io-client";

export const socket = io(getSocketUrl());

function getSocketUrl(): string {
  return process.env.NEXT_PUBLIC_SOCKET_SERVER as string;
}
