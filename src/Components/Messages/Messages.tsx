import './Messages.css';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { MessageItem, MessageItemProps } from '../MessageItem/MessageItem';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ChatContext } from '../../Contexts/chat.context';
import { Friend } from '../../models/friend';
import { ChatMessage } from '../../models/chatMessage';
import { User } from '../../models/user';
import { MessageCategory } from '../../models/messageCategory';
import { getMessages } from '../../Services/api.service';

export type MessagesProps = {
    userToChat?: Friend,
    connectedUser: User
};

export const Messages: FC<MessagesProps> = ({ userToChat, connectedUser }) => {
    const { registerEvent } = useContext(ChatContext);
    const chatActiveElement = useRef<HTMLElement>();
    const [messages, setMessages] = useState<MessageItemProps[]>([]);

    useEffect(() => {

        async function fetchMessages(userToChat: Friend) {
            var result: ChatMessage[] = await getMessages(userToChat.userId, connectedUser.accessToken);
            var messages: MessageItemProps[] = result.map(messageToMessageProp);
            setMessages(messages);
        }

        if (userToChat !== undefined) {
            // TODO: Fetch messages yield return 
            fetchMessages(userToChat);
        } else {
            // Clean messages
            setMessages([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userToChat]);

    const messageToMessageProp = (messageData: ChatMessage): MessageItemProps => {
        let type: MessageCategory = 'SENT';
        let avatarUrl = connectedUser.avatarUrl;
        if (messageData.to === connectedUser.id) {
            type = 'INCOMING';
            avatarUrl = userToChat?.avatarUrl ?? '';
        }

        const message: MessageItemProps = {
            id: messageData.id!,
            text: messageData.message,
            time: new Date(Date.parse(messageData.sentAt?.toString() ?? '')).getTime(),
            avatarUrl: avatarUrl,
            type: type
        }
        return message;
    }

    useEffect(() => {
        registerEvent('ReceiveMessage', (messageData: ChatMessage) => {
            if((userToChat !== undefined && userToChat.userId === messageData.from) || connectedUser.id === messageData.from) {
                let type: MessageCategory = 'SENT';
                let avatarUrl = connectedUser.avatarUrl;
                if (messageData.to === connectedUser.id) {
                    type = 'INCOMING';
                    avatarUrl = userToChat?.avatarUrl ?? '';
                }
                
                const message: MessageItemProps = {
                    id: messageData.id!,
                    text: messageData.message,
                    time: new Date(Date.parse(messageData.sentAt?.toString() ?? '')).getTime(),
                    avatarUrl: avatarUrl,
                    type: type
                }
                setMessages([...messages, message])
            }
        });
    }, [connectedUser.avatarUrl, connectedUser.id, messages, registerEvent, userToChat]);

    useEffect(() => {
        const curr = chatActiveElement.current;
        if (curr) {
            curr.scrollTo({ top: curr.scrollHeight });
        }
    }, [messages])

    return (
        <div className="pt-3 pe-3" style={{ position: "relative", height: "400px" }}>
            <PerfectScrollbar containerRef={el => (chatActiveElement.current = el)}>
                {
                    messages && messages.map((message: MessageItemProps, index) => (
                        <MessageItem key={index} {...message} />
                    ))
                }

            </PerfectScrollbar>
        </div>
    );
};