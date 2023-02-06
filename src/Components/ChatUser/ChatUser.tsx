import { FC } from 'react';
import { Friend } from '../../models/friend';
import './ChatUser.css'

type ChatUserProps = {
    user: Friend,
    onClick: (friend: Friend) => void
};


export const ChatUser: FC<ChatUserProps> = ({ user, onClick }) => {

    const startChat = () => {
        onClick(user);
    };

    return (
        <li className="p-2 border-bottom">
            <button onClick={startChat} className="d-flex justify-content-between text-decoration-none">
                <div className="d-flex flex-row">
                    <div>
                        <img
                            referrerPolicy='no-referrer'
                            src={user.avatarUrl}
                            alt="avatar" className="d-flex align-self-center me-3" width="60" />
                        <span className="badge bg-success badge-dot"></span>
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0 text-start">{user.fullName}</p>
                        {user.latestMessage !== undefined && user.latestMessage.id !== '' &&
                            <p className="small text-muted text-start">
                                {user.latestMessage.message}
                            </p>
                        }
                    </div>
                </div>
                <div className="pt-1">
                    <p className="small text-muted mb-1">Just now</p>
                    {user.unseenMessages > 0 &&
                        <span className="badge bg-danger rounded-pill float-end">{user.unseenMessages}</span>
                    }
                </div>
            </button>
        </li>
    );
};