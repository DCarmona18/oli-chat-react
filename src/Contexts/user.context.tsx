import { createContext, useEffect, useState } from 'react';
import { AUTH_TYPES } from '../models/constants';
import { User } from '../models/user';
import { authenticateUser } from '../Services/api.service';
import { onAuthStateChangedListener } from '../Utils/firebase.utils';

interface IUserContext {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const defaultState: IUserContext = {
    currentUser: null,
    setCurrentUser: (user: User | null) => null
};

// as the actual value you want to access
export const UserContext = createContext<IUserContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const value = { currentUser, setCurrentUser };
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user: any) => {
            // Every time the Authentication state changes it triggers this subscription
            console.info("User auth state changed:", user);
            if (user) {
                // The following method will create/authenticate user in the application

                // TODO: Call API to Create user if not exists
                try {
                    const userApi: User = await authenticateUser(user.accessToken, AUTH_TYPES.GOOGLE);
                    if (userApi !== null && userApi.id !== null) {
                        setCurrentUser({...userApi, accessToken: user.accessToken});
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                // TODO: Handle the setCurrentUser with your own rules
                setCurrentUser(null);
            }

        });

        return unsubscribe;
    }, []);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};