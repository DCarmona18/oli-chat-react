import { createContext, useEffect, useState } from 'react';
import { AUTH_TYPES } from '../models/constants';
import { User } from '../models/user';
import { authenticateUser } from '../Services/api.service';
import { onAuthStateChangedListener } from '../Utils/firebase.utils';
import { User as FirebaseUser, IdTokenResult } from "firebase/auth";

interface IUserContext {
    currentUser: User | null;
    
}

const defaultState: IUserContext = {
    currentUser: null,
    
};

// as the actual value you want to access
export const UserContext = createContext<IUserContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [accessToken, setAccessToken] = useState<string>("");

    const value = { currentUser };
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user: FirebaseUser) => {
            console.info('[TAG] Authstatechanged:', user);
            // Every time the Authentication state changes it triggers this subscription
            if (user) {
                // The following method will create/authenticate user in the application
                try {
                    const idTokenResult: IdTokenResult = await user.getIdTokenResult(true);
                    const userApi: User = await authenticateUser(idTokenResult.token, AUTH_TYPES.GOOGLE);
                    if (userApi !== null && userApi.id !== null) {
                        console.log("[TAG] Token expires at:", idTokenResult.expirationTime);
                        setCurrentUser(userApi);
                        setFirebaseUser(user);
                        setAccessToken(idTokenResult.token);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setCurrentUser(null);
                setFirebaseUser(null);
                setAccessToken("");
            }

        });

        return unsubscribe;
    }, []);
    

    useEffect(() => {
        if (firebaseUser) {
            console.log("[INTERVAL] Interval initialized");
            const intervalId = setInterval(() => {
                console.log("[INTERVAL] Interval run");
                firebaseUser.getIdTokenResult().then((idTokenResult: IdTokenResult) => {
                    const expiresIn = (new Date(idTokenResult.expirationTime)).getTime() - Date.now();

                    // Check if the access token has expired or will expire soon
                    console.log("[INTERVAL] Expires at: ", idTokenResult.expirationTime);
                    console.log("[INTERVAL] Expires in: ", expiresIn);
                    if (expiresIn < 6 * 60 * 1000) {
                        console.log("[INTERVAL] Expired!");
                        // The access token has expired or will expire in less than 5 minutes
                        // Refresh the token
                        firebaseUser.getIdToken(/* forceRefresh */ true).then((refreshedToken: string) => {
                            //console.log("[INTERVAL] old token:", currentUser?.accessToken);
                            console.log("[INTERVAL] new token:", refreshedToken);
                            setAccessToken(refreshedToken);
                            console.log("[INTERVAL] Access token refreshed");
                        }).catch((error: any) => {
                            // FIXME: Handle errors
                            console.error("Error refreshing access token:", error);
                        });
                    }
                });
                // We set the interval time to 55 minutes to ensure that the access token is always valid when the user is active.
            }, 55 * 60 * 1000);

            return () => clearInterval(intervalId);
        }
    }, [firebaseUser]);

    useEffect(() => {
        console.log("[TAG] Setting token: ", accessToken);
        setCurrentUser(prevPerson => (prevPerson !== null ? { ...prevPerson, accessToken: accessToken } : null));
    }, [accessToken]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};