export type ChatMessage = {
    id?: string,
    from?: string,
    to: string,
    message: string,
    type: 'PLAIN_TEXT' | 'IMAGE'
    seen?: boolean,
    sentAt?: Date
};