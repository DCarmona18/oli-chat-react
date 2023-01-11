import { FC } from 'react';
import { ConnectedUser } from '../../models/connectedUser';
import { ChatUser } from '../ChatUser/ChatUser';
import './ChatUsers.css';

export type ChatUsersProps = {
    connectedUsers: ConnectedUser[]
};


export const ChatUsers : FC<ChatUsersProps>= ({connectedUsers}) => {
    return (
        <ul className="list-unstyled mb-0">
            {
                connectedUsers && connectedUsers.map((connectedUser: ConnectedUser, index) => (
                    <ChatUser key={index} user={connectedUser}/>
                ))
            }
        </ul>
    );
};