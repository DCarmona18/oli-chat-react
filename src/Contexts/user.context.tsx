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
    const [user, setUser] = useState<any>(null);
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
                        setUser(user);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setCurrentUser(null);
                setUser(null);
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
    }, []);

    useEffect(() => {
        if (user) {
            const intervalId = setInterval(() => {
                user.getIdTokenResult().then((idTokenResult: any) => {
                    const expiresIn = (new Date(idTokenResult.expirationTime)).getTime() - Date.now();

                    // Check if the access token has expired or will expire soon
                    if (expiresIn < 5 * 60 * 1000) {
                        // The access token has expired or will expire in less than 5 minutes
                        // Refresh the token
                        user.getIdToken(/* forceRefresh */ true).then((refreshedToken: string) => {
                            setCurrentUser({ ...currentUser as User, accessToken: refreshedToken });
                            console.log("[TAG] Access token refreshed");
                        }).catch((error: any) => {
                            // ERROR: Handle errors
                            console.error("Error refreshing access token:", error);
                        });
                    }
                });
                // We set the interval time to 55 minutes to ensure that the access token is always valid when the user is active.
            }, 55 * 60 * 1000);

            return () => clearInterval(intervalId);
        }
    }, [user]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};