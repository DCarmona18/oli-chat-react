import { createContext, useEffect, useState } from 'react';
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
        const unsubscribe = onAuthStateChangedListener((user: any) => {
            // Every time the Authentication state changes it triggers this subscription
            console.log("User on auth changed:", user);

            if (user) {
                // The following method will create/authenticate user in the application

                // TODO: Call API to Create user if not exists
                // authenticateUser(user.accessToken)
                //     .then((result) => {
                //         console.log(result);
                //         // Send accessToken to API
                //         // It will return User
                //         // Set user in context
                //     })
                //     .catch((error) => console.error(error));
            }

            // TODO: Handle the setCurrentUser with your own rules
            // setCurrentUser(user);
        });

        return unsubscribe;
    }, []);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};