import './FriendRequestButton.css'
import { faUserClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useContext, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { User } from "../../models/user";
import { FriendRequests } from '../FriendRequests/FriendRequests';
import { UserContext } from '../../Contexts/user.context';

export type FriendRequestButtonProps = {
    currentUser: User | null;
};

export const FriendRequestButton: FC<FriendRequestButtonProps> = ({ currentUser }) => {
    const { friendRequests } = useContext(UserContext);
    const [showFR, setShow] = useState(false);


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