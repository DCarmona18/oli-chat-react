import { HubConnectionBuilder, IHttpConnectionOptions } from "@microsoft/signalr";
import { HubConnection, HubConnectionState } from "@microsoft/signalr/dist/esm/HubConnection";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { createContext, useContext, useEffect, useState } from "react";
import { ConnectedUser } from "../models/connectedUser";
import { UserContext } from "./user.context";

interface IChatContext {
    connection: HubConnection | null;
    connectedUsers: ConnectedUser[];
    sendMessage: (user: string, message: string) => void;
    registerEvent: (methodName: string, callback: (...args: any[]) => void) => void;
    setConnectedUsers: (connectedUsers: ConnectedUser[]) => void;
}

const defaultState: IChatContext = {
    connection: null,
    connectedUsers: [],
    sendMessage: () => { },
    registerEvent: () => { },
    setConnectedUsers: () => { }
};

interface Props {
    children: React.ReactNode;
}

export const ChatContext = createContext<IChatContext>(defaultState);

export const ChatProvider: React.FC<Props> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
    const { currentUser } = useContext(UserContext);
    
    useEffect(() => {
        if (!currentUser?.accessToken) 
            return;

        // TODO: Fix reconnect issue
        const options: IHttpConnectionOptions = {
            headers: { 'Authorization': `Bearer ${currentUser.accessToken}` }
        };
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}hubs/chat`, options)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Critical)
            .build();
        
        setConnection(newConnection);
    }, [currentUser]);

    useEffect(() => {
        if ((!currentUser?.accessToken && connection) || connection?.state === HubConnectionState.Connected)
            return;

        if (connection && connection?.state === HubConnectionState.Disconnected) {
            connection.start()
                .then(async () => {
                    if (connection?.state === HubConnectionState.Connected) {
                        try {
                            console.log("Connected");
                            registerEvent('ConnectedToHub', (user: ConnectedUser) => {
                                console.log("Connected to hub:", user);
                                if (user.connectionId !== connection.connectionId && user.email !== currentUser?.email)
                                    setConnectedUsers([user].concat(connectedUsers));
                            });
                        }
                        catch (e) {
                            // TODO: Handle errors
                            console.log(e);
                        }
                    }
                })
                .catch(e => {
                    // TODO: Handle errors
                    console.log('Connection failed: ', e);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectedUsers, connection, currentUser]);

    const sendMessage = async (user: string, message: string) => {
        const chatMessage = {
            userIdSender: currentUser?.id ?? 'AnonymousUser',
            message: message
        };

        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection.send('SendMessage', chatMessage);
            }
            catch (e) {
                // TODO: Handle errors
                console.log(e);
            }
        }
        else {
            // TODO: Handle errors
            alert('No connection to server yet.');
        }
    };

    const registerEvent = (methodName: string, callback: (...args: any[]) => void) => {
        connection?.off(methodName);
        connection?.on(methodName, callback);
    };

    const value = { connection, connectedUsers, sendMessage, registerEvent, setConnectedUsers };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};