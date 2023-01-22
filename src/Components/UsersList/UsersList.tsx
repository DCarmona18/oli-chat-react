import './UsersList.css';
import { FC, useContext, useEffect, useRef } from 'react';
import { Friend } from '../../models/friend';
import { ChatUser } from '../ChatUser/ChatUser';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchFriends } from '../../Services/api.service';
import { ChatContext } from '../../Contexts/chat.context';
import { UserContext } from '../../Contexts/user.context';

export const UsersList: FC = () => {
    const { setFriends, friends } = useContext(ChatContext);
    const { currentUser } = useContext(UserContext);

    const chatListElement = useRef<HTMLElement>();

    useEffect(() => {
        if(!currentUser?.accessToken)
            return;

        // Fetch friends
        fetchFriends(currentUser?.accessToken)
        .then((friends: Friend[])=> {
            setFriends(friends);
        });
    }, [currentUser?.accessToken, setFriends]);

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
                        friends && friends.map((friend: Friend, index) => (
                            <ChatUser key={index} user={friend} />
                        ))
                    }
                </ul>
            </div>
        </PerfectScrollbar>

    );
};