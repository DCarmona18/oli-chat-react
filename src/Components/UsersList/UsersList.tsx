import './UsersList.css';
import { FC, useContext, useEffect, useRef } from 'react';
import { Friend } from '../../models/friend';
import { ChatUser } from '../ChatUser/ChatUser';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchFriends } from '../../Services/api.service';
import { ChatContext } from '../../Contexts/chat.context';
import { UserContext } from '../../Contexts/user.context';

export type UsersListProps = {
    onChatInitializer: (friend: Friend) => void
};

export const UsersList: FC<UsersListProps> = ({onChatInitializer}) => {
    const { setFriends, friends, registerEvent } = useContext(ChatContext);
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

    useEffect(() => {
        registerEvent('FriendRequestAccepted', (friend: Friend) => {
            // TODO: Prettyfy alerts
            alert(`${friend.fullName} has accepted your friend request.`);
            setFriends([friend].concat(friends));
        });
    }, [friends, registerEvent, setFriends])
    
    return (
        <PerfectScrollbar containerRef={el => (chatListElement.current = el)}>
            <div style={{ position: "relative", height: "400px" }}>
                <ul className="list-unstyled mb-0">
                    {
                        friends && friends.map((friend: Friend, index) => (
                            <ChatUser key={index} onClick={onChatInitializer} user={friend} />
                        ))
                    }
                </ul>
            </div>
        </PerfectScrollbar>

    );
};