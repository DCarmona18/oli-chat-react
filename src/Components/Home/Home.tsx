import './Home.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutFirebase } from '../../Utils/firebase.utils';
import { UserContext } from '../../Contexts/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ChatContext } from '../../Contexts/chat.context';
import { UsersList } from '../UsersList/UsersList';
import { Messages } from '../Messages/Messages';
import { Textbox } from '../Textbox/Textbox';
import { Button, Form, Modal } from 'react-bootstrap';
import { isValidEmail } from '../../Utils/helpers.utils';
import { addFriend } from '../../Services/api.service';
import { Friend } from '../../models/friend';
import { FriendRequest } from '../../models/friendRequest';
import { FriendRequestButton } from '../FriendRequestButton/FriendRequestButton';

const Home = () => {
    const { currentUser } = useContext(UserContext);
    const { sendMessage, connection } = useContext(ChatContext);
    const [show, setShow] = useState(false);
    const [userToChat, setUserToChat] = useState<Friend | undefined>(undefined);
    const handleClose = () => {
        setShow(false);
        setEmailNewFriend('');
    };

    const handleShow = () => setShow(true);

    const [emailNewFriend, setEmailNewFriend] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser == null)
            navigate("/login");
    }, [currentUser, navigate]);

    const onSendMessage = (message: string) => {
        userToChat !== undefined &&
            message !== '' &&
            sendMessage(userToChat.userId, message);
    };

    const sendFriendRequest = async () => {
        const email = emailNewFriend.trim();
        try {
            const friendRequest: FriendRequest = await addFriend(email, currentUser?.accessToken);
            if (friendRequest.id !== null) {
                setEmailNewFriend('');
                handleClose();
                // TODO: Prettyfy alerts
                alert('Request sent');
                // Refresh friends list to the left
                // TODO: Trigger event to tell receiver "new friend request".
            } else {
                // TODO: Prettyfy alerts
                alert('User is already in your friends or the request hasn\'t been accepted.');
            }

        } catch (error) {
            // TODO: Handle errors
            console.error(error);
        }
    };

    const initializeChat = (friend: Friend) => {
        console.log("Initializing chat with:", friend);
        setUserToChat(friend);
    }

    return (<>
        {currentUser &&
            <>
                <div className='w-100 m-auto form-signin'>
                    <img src={currentUser.avatarUrl} alt={"User profile"} className="rounded img-fluid img-thumbnail" referrerPolicy='no-referrer' />
                    <p className='w-100 m-auto'>{currentUser.fullName}</p>
                    <p className='w-100 m-auto'>{currentUser.email}</p>
                    <p className='w-100 m-auto'>{connection?.connectionId}</p>
                </div>
                <div className="w-100">
                    <div className="col-6">
                        <button onClick={logoutFirebase} className='btn btn-secondary w-40'>Logout</button>
                    </div>
                </div>
                <section style={{ backgroundColor: "#CDC4F9" }}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card" id="chat3" style={{ borderRadius: "15px" }}>
                                    <div className='d-flex flex-row justify-content-end m-2'>
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Add friend</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        <Form.Label>Email address</Form.Label>
                                                        <Form.Control size='sm' required onChange={(e) => setEmailNewFriend(e.target.value)} type="email" placeholder="name@example.com" />
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                                <Button disabled={!isValidEmail(emailNewFriend)} type='button' variant="primary" onClick={sendFriendRequest}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <Button variant='success' onClick={handleShow}><FontAwesomeIcon icon={faUserPlus} /></Button>
                                        <FriendRequestButton currentUser={currentUser} />
                                    </div>
                                    <hr />
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-2 col-md-4 col-lg-4 col-xl-4 mb-4 mb-md-0">
                                                <div className="p-3">
                                                    <div className="input-group rounded mb-3 border-bottom">
                                                        <input type={"search"} className="form-control rounded" placeholder="Search" aria-label="Search"
                                                            aria-describedby="search-addon" />
                                                        <span className="input-group-text border-0" id="search-addon">
                                                            <FontAwesomeIcon icon={faSearch} />
                                                        </span>
                                                    </div>
                                                    <UsersList onChatInitializer={initializeChat} />
                                                </div>
                                            </div>
                                            <div className="col-sm-10 col-md-8 col-lg-8 col-xl-8">
                                                <Messages key={'ChatMessages'} userToChat={userToChat} connectedUser={currentUser} />
                                                <Textbox key={'textBox'} onSendMessage={(message) => onSendMessage(message)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </>

        }
    </>)
};

export default Home