import { ChatMessage } from "./chatMessage";

export type Friend = {
    userId: string;
    connectionId: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    status?: 'ONLINE'|'OFFLINE'| 'AWAY';
    latestMessage?: ChatMessage
    unseenMessages: number;
};