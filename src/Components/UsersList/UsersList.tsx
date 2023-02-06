import './UsersList.css';
import { FC, useContext, useEffect, useRef } from 'react';
import { Friend } from '../../models/friend';
import { ChatUser } from '../ChatUser/ChatUser';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchFriends, seen } from '../../Services/api.service';
import { ChatContext } from '../../Contexts/chat.context';
import { UserContext } from '../../Contexts/user.context';
import { ChatMessage } from '../../models/chatMessage';

export type UsersListProps = {
    onChatInitializer: (friend: Friend) => void;
    userToChat: Friend | undefined;
};

export const UsersList: FC<UsersListProps> = ({ onChatInitializer, userToChat }) => {
    const { setFriends, friends, registerEvent } = useContext(ChatContext);
    const { currentUser } = useContext(UserContext);

    const chatListElement = useRef<HTMLElement>();

    useEffect(() => {
        if (!currentUser?.accessToken)
            return;

        // Fetch friends
        fetchFriends(currentUser?.accessToken)
            .then((friends: Friend[]) => {
                setFriends(friends);
            })
            .catch((error) => {
                // TODO: Log error
                console.error(error);
            });
    }, [currentUser?.accessToken, setFriends]);

    useEffect(() => {
        registerEvent('NewMessage', (message: ChatMessage) => {
            const newFriends = friends.map((friend) => {
                if (friend.userId === message.from) {
                    friend.latestMessage = message;
                    if (userToChat === undefined || userToChat.userId !== friend.userId) {
                        friend.unseenMessages++;
                    }
                }

                return friend;
            });
            setFriends(newFriends);
        });
    }, [currentUser?.id, friends, registerEvent, setFriends, userToChat]);

    useEffect(() => {
        registerEvent('MarkAsSeen', (userId: string) => {
            const newFriends = friends.map((friend) => {
                if (friend.userId === userId) {
                    friend.unseenMessages = 0;
                }

                return friend;
            });
            setFriends(newFriends);
        });
    }, [friends, registerEvent, setFriends]);

    useEffect(() => {
        registerEvent('FriendRequestAccepted', (friend: Friend) => {
            // TODO: Prettyfy alerts
            alert(`${friend.fullName} has accepted your friend request.`);
            setFriends([friend].concat(friends));
        });
    }, [friends, registerEvent, setFriends]);

    const initializeChatHandler = (friend: Friend) => {
        seen(currentUser?.accessToken, friend)
            .catch((error) => {
                // TODO: Handle errors
                console.error(error);
            });
        onChatInitializer(friend);
    };

    return (
        <PerfectScrollbar containerRef={el => (chatListElement.current = el)}>
            <div style={{ position: "relative", height: "400px" }}>
                <ul className="list-unstyled mb-0">
                    {
                        friends && friends.map((friend: Friend, index) => (
                            <ChatUser key={index} onClick={async () => initializeChatHandler(friend)} user={friend} />
                        ))
                    }
                </ul>
            </div>
        </PerfectScrollbar>

    );
};