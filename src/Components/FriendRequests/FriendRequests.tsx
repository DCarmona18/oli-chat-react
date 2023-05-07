import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, FC } from 'react';
import { ChatContext } from '../../Contexts/chat.context';
import { Friend } from '../../models/friend';
import { FriendRequest, FriendRequestStatus } from '../../models/friendRequest';
import { User } from '../../models/user';
import { friendRequestRespond } from '../../Services/api.service';
import './FriendRequests.css';

export type FriendRequestsProps = {
    friendRequests: FriendRequest[];
    currentUser: User | null;
};

export const FriendRequests: FC<FriendRequestsProps> = ({ friendRequests, currentUser }) => {
    const { setFriends, friends, invokeHubMethod, setFriendRequests } = useContext(ChatContext);

    const accept = async (friendRequest: FriendRequest) => {
        friendRequest.status = FriendRequestStatus.Accepted;
        try {
            const friend: Friend = await friendRequestRespond(friendRequest, currentUser?.accessToken);
            if (friend !== null) {
                setFriendRequests(friendRequests.filter((fr) => fr.id !== friendRequest.id));
                setFriends([friend].concat(friends));
                await invokeHubMethod('FriendRequestAccepted', friend);
            } else {
                // TODO: I forgot 
            }
        } catch (error) {
            // ERROR: Log error
            console.error(error);
        }
    };

    const reject = (friendRequest: FriendRequest) => {
        friendRequest.status = FriendRequestStatus.Rejected;
        friendRequestRespond(friendRequest, currentUser?.accessToken);
        setFriendRequests(friendRequests.filter((fr) => fr.id !== friendRequest.id));
    };

    return (
        <>
            {friendRequests && friendRequests.map((friendRequest, index) => (
                <div className="row" key={friendRequest.id}>
                    <div className="col-2 m-auto">
                        <img height={'60px'} src={friendRequest.avatarUrl} referrerPolicy='no-referrer' alt={`Avatar for user ${friendRequest.name}`} />
                    </div>
                    <div className="col-6 m-auto">
                        <p className="mt-3">{friendRequest.name}</p>
                    </div>
                    <div className="col-4 m-auto text-center">
                        <button onClick={() => accept(friendRequest)} type="button" aria-label='Accept request' className="btn btn-success m-1"><FontAwesomeIcon icon={faCheck} /></button>
                        <button onClick={() => reject(friendRequest)} type="button" aria-label='Reject request' className="btn btn-danger m-1"><FontAwesomeIcon icon={faCancel} /></button>
                    </div>
                </div>
            )
            )}
        </>
    );
};