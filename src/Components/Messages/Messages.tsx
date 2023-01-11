import './Messages.css';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { MessageItem, MessageItemProps } from '../MessageItem/MessageItem';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ChatContext } from '../../Contexts/chat.context';

export type MessagesProps = {
    fromAvatarUrl: string,
    toAvatarUrl: string
};

export const Messages: FC<MessagesProps> = ({ fromAvatarUrl, toAvatarUrl }) => {
    const { registerEvent } = useContext(ChatContext);
    const chatActiveElement = useRef<HTMLElement>();
    const [messages, setMessages] = useState<MessageItemProps[]>([]);
    useEffect(() => {

        registerEvent('ReceiveMessage', (messageData) => {
            const message: MessageItemProps = {
                text: messageData.message,
                time: Date.now(),
                avatarUrl: messageData.avatarUrl,
                type: 'INCOMING'
            }
            setMessages([...messages, message])
        });

        registerEvent('SentMessage', (messageData) => {
            const message: MessageItemProps = {
                text: messageData.message,
                time: Date.now(),
                avatarUrl: messageData.avatarUrl,
                type: 'SENT'
            }
            setMessages([...messages, message])
        });
    }, [messages, registerEvent]);

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