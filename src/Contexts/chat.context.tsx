import { HubConnectionBuilder, IHttpConnectionOptions } from "@microsoft/signalr";
import { HubConnection, HubConnectionState } from "@microsoft/signalr/dist/esm/HubConnection";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { createContext, useContext, useEffect, useState } from "react";
import { ChatMessage } from "../models/chatMessage";
import { Friend } from "../models/friend";
import { UserContext } from "./user.context";
import { FriendRequest } from "../models/friendRequest";
import { getFriendRequests } from "../Services/api.service";

interface IChatContext {
    connection: HubConnection | null;
    friends: Friend[];
    sendMessage: (to: string, message: string) => void;
    registerEvent: (methodName: string, callback: (...args: any[]) => void) => void;
    setFriends: (friends: Friend[]) => void;
    invokeHubMethod: <T, >(method: string, data: T) => void;
    friendRequests: FriendRequest[];
    setFriendRequests: (friendRequests: FriendRequest[]) => void;
}

const defaultState: IChatContext = {
    connection: null,
    friends: [],
    sendMessage: () => { },
    registerEvent: () => { },
    setFriends: () => { },
    invokeHubMethod: () => { },
    friendRequests: [],
    setFriendRequests: (friendRequests) => null
};

interface Props {
    children: React.ReactNode;
}

export const ChatContext = createContext<IChatContext>(defaultState);

export const ChatProvider: React.FC<Props> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const { currentUser } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        if (!currentUser?.accessToken)
            return;

        const options: IHttpConnectionOptions = {
            headers: { 'Authorization': `Bearer ${currentUser.accessToken}` }
        };

        const newConnectionBuilder = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}hubs/chat`, options)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information);

        const newConnection = newConnectionBuilder.build();

        setConnection(newConnection);
    }, [currentUser?.accessToken]);

    useEffect(() => {
        console.info("[TAG] Setting up signalR");

        async function setUpSignalR() {
            if (connection) {
                try {
                    await connection.start();
                } catch (error) {
                    // ERROR: Handle errors
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
            // TODO: Validate if token is valid, if not refresh.
        });

        connection?.onreconnected(() => {
            console.info("[TAG] Reconnected");
            // setIsConnectedToHub(true);
            // TODO: When reconnected refresh friend list, active chat messages, friend request list, friend request accepted maybe with a global variable
        });

        connection?.onclose(() => {
            console.info("[TAG] OnClose");
            // setIsConnectedToHub(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection]);

    useEffect(() => {
        async function fetchFriendRequests() {
            const friendsRequests: FriendRequest[] = await getFriendRequests(currentUser?.accessToken);
            if (friendsRequests !== null && friendsRequests.length > 0)
                setFriendRequests(friendsRequests);
        }

        console.log("[TAG] Fetching friend requests");
        fetchFriendRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = async (to: string, message: string) => {
        // TODO: Send user to chat to mark as seen
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
                // FIXME: Handle errors
                console.log(e);
            }
        }
        else {
            // FIXME: Handle errors
            alert('No connection to server yet.');
        }
    };

    const invokeHubMethod = async <T,>(method: string, data: T) => {
        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection.send(method, data);
            }
            catch (e) {
                // FIXME: Handle errors
                console.log(e);
            }
        }
        else {
            // FIXME: Handle errors
            alert('No connection to server yet.');

            // TODO: Handle reconnection
        }
    };

    const registerEvent = (methodName: string, callback: (...args: any[]) => void) => {
        connection?.off(methodName);
        connection?.on(methodName, callback);
    };

    const value = { connection, friends, friendRequests, sendMessage, registerEvent, setFriends, invokeHubMethod, setFriendRequests };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};