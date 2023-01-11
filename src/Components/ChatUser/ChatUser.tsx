import { FC } from 'react';
import { ConnectedUser } from '../../models/connectedUser';
import './ChatUser.css';

type ChatUserProps = {
    user: ConnectedUser
};


export const ChatUser : FC<ChatUserProps> = ({user}) => {
    return (
        <li className="p-2 border-bottom">
            <a href="#!" className="d-flex justify-content-between text-decoration-none">
                <div className="d-flex flex-row">
                    <div>
                        <img
                            src={user.avatarUrl}
                            alt="avatar" className="d-flex align-self-center me-3" width="60" />
                        <span className="badge bg-success badge-dot"></span>
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0 text-start">{user.fullName}</p>
                        <p className="small text-muted">{user.connectionId}</p>
                    </div>
                </div>
                <div className="pt-1">
                    <p className="small text-muted mb-1">Just now</p>
                    <span className="badge bg-danger rounded-pill float-end">3</span>
                </div>
            </a>
        </li>
    );
};