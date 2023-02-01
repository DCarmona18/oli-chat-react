import { createContext, useEffect, useState } from 'react';
import { AUTH_TYPES } from '../models/constants';
import { FriendRequest } from '../models/friendRequest';
import { User } from '../models/user';
import { authenticateUser, getFriendRequests } from '../Services/api.service';
import { onAuthStateChangedListener } from '../Utils/firebase.utils';

interface IUserContext {
    currentUser: User | null;
    friendRequests: FriendRequest[];
    setCurrentUser: (user: User | null) => void;
    setFriendRequests: (friendRequests: FriendRequest[]) => void;
}

const defaultState: IUserContext = {
    currentUser: null,
    friendRequests: [],
    setCurrentUser: (user: User | null) => null,
    setFriendRequests: (friendRequests) => null
};

// as the actual value you want to access
export const UserContext = createContext<IUserContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const value = { currentUser, friendRequests, setCurrentUser, setFriendRequests };
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user: any) => {
            console.info('[TAG] Authstatechanged:', user);
            // Every time the Authentication state changes it triggers this subscription
            if (user) {
                // The following method will create/authenticate user in the application
                try {
                    const userApi: User = await authenticateUser(user.accessToken, AUTH_TYPES.GOOGLE);
                    if (userApi !== null && userApi.id !== null) {
                        setCurrentUser({ ...userApi, accessToken: user.accessToken });
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setCurrentUser(null);
            }

        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        async function fetchFriendRequests() {
            const friendsRequests: FriendRequest[] = await getFriendRequests(currentUser?.accessToken);
            if (friendsRequests !== null && friendsRequests.length > 0)
                setFriendRequests(friendsRequests);
        }
        fetchFriendRequests();
    }, [currentUser?.accessToken]);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};