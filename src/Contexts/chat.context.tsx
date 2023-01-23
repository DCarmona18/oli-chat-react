import { HubConnectionBuilder, IHttpConnectionOptions } from "@microsoft/signalr";
import { HubConnection, HubConnectionState } from "@microsoft/signalr/dist/esm/HubConnection";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { createContext, useContext, useEffect, useState } from "react";
import { ChatMessage } from "../models/chatMessage";
import { Friend } from "../models/friend";
import { UserContext } from "./user.context";

interface IChatContext {
    connection: HubConnection | null;
    friends: Friend[];
    sendMessage: (to: string, message: string) => void;
    registerEvent: (methodName: string, callback: (...args: any[]) => void) => void;
    setFriends: (friends: Friend[]) => void;
}

const defaultState: IChatContext = {
    connection: null,
    friends: [],
    sendMessage: () => { },
    registerEvent: () => { },
    setFriends: () => { }
};

interface Props {
    children: React.ReactNode;
}

export const ChatContext = createContext<IChatContext>(defaultState);

export const ChatProvider: React.FC<Props> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        console.log("[TAG]Setting connection:", currentUser);

        if (!currentUser?.accessToken)
            return;

        const options: IHttpConnectionOptions = {
            headers: { 'Authorization': `Bearer ${currentUser.accessToken}` }
        };
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}hubs/chat`, options)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, [currentUser]);

    useEffect(() => {
        console.info("[TAG] Setting up signalR");

        async function setUpSignalR() {
            if (connection) {
                try {
                    await connection.start();
                } catch (error) {
                    // TODO: Handle errors
                    console.log('Connection failed: ', error);
                }
                console.log("[TAG] Connection state:", connection.state, connection.connectionId);
            }
        }

        setUpSignalR();

        return () => {
            console.info("[TAG] Disconnecting:", connection?.state, connection?.connectionId)
            connection?.stop();
        }
    }, [connection]);

    useEffect(() => {
        registerEvent('ConnectedToHub', (user: Friend) => {
            console.info("[TAG] Connected to hub:", user);
            // TODO: Set status of friend to online when connected
            // if (user.connectionId !== connection?.connectionId && user.email !== currentUser?.email)
            //     setFriends([user].concat(friends));
        });
        registerEvent('DisconnectedFromHub', (user: Friend) => {
            console.info("[TAG] Disconnected from Hub:", user);
            // TODO: Set status of friend to offline when disconnected
            // setFriends(friends.filter((connectedUser: Friend) => connectedUser.userId !== user.userId))
        });
        connection?.onreconnecting((error) => {
            console.info("[TAG] Reconnecting");
        });

        connection?.onreconnected(() => {
            console.info("[TAG] Reconnected");
        });

        connection?.onclose(() => {
            console.info("[TAG] OnClose");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friends, connection?.connectionId, currentUser?.email]);

    const sendMessage = async (to: string, message: string) => {
        // TODO: Structure the message object
        const chatMessage: ChatMessage = {
            to,
            message,
            type: 'PLAIN_TEXT'
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

    const value = { connection, friends, sendMessage, registerEvent, setFriends };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};