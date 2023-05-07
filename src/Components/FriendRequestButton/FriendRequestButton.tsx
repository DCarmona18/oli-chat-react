import './FriendRequestButton.css'
import { faUserClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useContext, useEffect, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { User } from "../../models/user";
import { FriendRequests } from '../FriendRequests/FriendRequests';
import { ChatContext } from '../../Contexts/chat.context';
import { FriendRequest } from '../../models/friendRequest';

export type FriendRequestButtonProps = {
    currentUser: User | null;
};

export const FriendRequestButton: FC<FriendRequestButtonProps> = ({ currentUser }) => {
    const { registerEvent, setFriendRequests, friendRequests } = useContext(ChatContext);
    const [showFR, setShow] = useState(false);

    useEffect(() => {
        registerEvent('NewFriendRequest', (friendRequest: FriendRequest) => {
            setFriendRequests([friendRequest].concat(friendRequests));
        });
    }, [friendRequests, registerEvent, setFriendRequests])

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <Modal show={showFR} onHide={handleClose} scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Friend Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FriendRequests friendRequests={friendRequests} currentUser={currentUser} />
                </Modal.Body>
            </Modal>
            <Button variant="secondary" onClick={handleShow}>
                <FontAwesomeIcon icon={faUserClock} /> <Badge bg="secondary">{friendRequests.length}</Badge>
                <span className="visually-hidden">friend requests</span>
            </Button>
        </>
    );
};