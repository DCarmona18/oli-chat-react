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
import { addFriend as addFriendService } from '../../Services/api.service';
import { Friend } from '../../models/friend';

const Home = () => {
    const { currentUser } = useContext(UserContext);
    const { sendMessage, connection, setFriends, friends } = useContext(ChatContext);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setEmailNewFriend('');
    }

    const handleShow = () => setShow(true);

    const [emailNewFriend, setEmailNewFriend] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser == null)
            navigate("/login");
    }, [currentUser, navigate]);

    const onSendMessage = (message: string) => {
        message !== '' && sendMessage(currentUser?.id ?? 'Anonymous', message);
    };

    const addFriend = async () => {
        const email = emailNewFriend.trim();
        try {
            const friend: Friend = await addFriendService(email, currentUser?.accessToken);
            if (friend.userId !== null) {
                setEmailNewFriend('');
                handleClose();
                // TODO: Prettyfy alerts
                alert('New friend added');
                // Refresh friends list to the left
                setFriends([friend].concat(friends));
                // Close modal
            } else {
                // TODO: Prettyfy alerts
                alert('User is already in your friends list');
            }

        } catch (error) {
            // TODO: Handle errors
            console.error(error);
        }
    };

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
                                                <Button disabled={!isValidEmail(emailNewFriend)} type='button' variant="primary" onClick={addFriend}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <Button variant='success' onClick={handleShow}><FontAwesomeIcon icon={faUserPlus} /></Button>
                                    </div>
                                    <hr />
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                                                <div className="p-3">
                                                    <div className="input-group rounded mb-3 border-bottom">
                                                        <input type={"search"} className="form-control rounded" placeholder="Search" aria-label="Search"
                                                            aria-describedby="search-addon" />
                                                        <span className="input-group-text border-0" id="search-addon">
                                                            <FontAwesomeIcon icon={faSearch} />
                                                        </span>
                                                    </div>
                                                    <UsersList />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-7 col-xl-8">
                                                <Messages fromAvatarUrl={currentUser.avatarUrl} toAvatarUrl={'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp'} />
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