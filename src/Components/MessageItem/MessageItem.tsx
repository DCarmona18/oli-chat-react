import { FC } from 'react';
import { MessageCategory } from '../../models/messageCategory';
import './MessageItem.css';

export type MessageItemProps = {
    id: string,
    type: MessageCategory,
    text: string,
    time: number,
    avatarUrl: string
};

export const MessageItem: FC<MessageItemProps> = ({ text, time, type, avatarUrl, id }) => {
    let messageContainerClass = 'd-flex flex-row justify-content-end';
    let messageTextClass = 'small p-2 ms-3 mb-1 rounded-3 text-start bg-primary me-3 text-white';
    let timeClass = 'small rounded-3 mb-3 text-muted me-3 text-start';
    if(type === 'INCOMING'){
        messageContainerClass = 'd-flex flex-row justify-content-start';
        messageTextClass = 'small p-2 ms-3 mb-1 rounded-3 text-start bg-incoming-msg';
        timeClass = 'small rounded-3 mb-3 text-muted ms-3 float-end';
    }
    return (
        <div key={id} className={messageContainerClass}>
            {
                type === 'INCOMING' && 
                <img referrerPolicy='no-referrer' src={avatarUrl} alt="avatar 1" style={{ width: "45px", height: "100%" }} />
            }
            <div>
                <p className={messageTextClass}>
                    {text}
                </p>
                <p className={timeClass}>{new Date(time).getHours()}:{new Date(time).getMinutes()}| Aug 13</p>
            </div>
            {
                type === 'SENT' && <img referrerPolicy='no-referrer' src={avatarUrl} alt="avatar 1" style={{ width: "45px", height: "100%" }} />
            }
        </div>
    );
};