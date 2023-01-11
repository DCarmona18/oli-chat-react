import './UsersList.css';
import { FC, useContext, useEffect, useRef } from 'react';
import { ConnectedUser } from '../../models/connectedUser';
import { ChatUser } from '../ChatUser/ChatUser';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchConnectedUsersHub } from '../../Services/api.service';
import { ChatContext } from '../../Contexts/chat.context';
import { UserContext } from '../../Contexts/user.context';

// export type ChatUsersProps = {
//     connectedUsers: ConnectedUser[]
// };


export const UsersList: FC = () => {
    const { setConnectedUsers, connectedUsers } = useContext(ChatContext);
    const { currentUser } = useContext(UserContext);

    const chatListElement = useRef<HTMLElement>();

    useEffect(() => {
        if(!currentUser?.accessToken)
            return;

        // Fetch connected users to the hub
        fetchConnectedUsersHub(currentUser?.accessToken)
        .then((connectedUsers: ConnectedUser[])=> {
            setConnectedUsers(connectedUsers);
        });
    }, [currentUser?.accessToken, setConnectedUsers]);

    const scrollChatlist = () => {
        const curr = chatListElement.current;
        if (curr) {
            curr.scrollTo({
                top: 0
            });
        }
    };
    return (
        <PerfectScrollbar containerRef={el => (chatListElement.current = el)}>
            <div style={{ position: "relative", height: "400px" }}>
                <ul className="list-unstyled mb-0">
                    {
                        connectedUsers && connectedUsers.map((connectedUser: ConnectedUser, index) => (
                            <ChatUser key={index} user={connectedUser} />
                        ))
                    }
                </ul>
            </div>
        </PerfectScrollbar>

    );
};