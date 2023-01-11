import './Home.css';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutFirebase } from '../../Utils/firebase.utils';
import { UserContext } from '../../Contexts/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ChatContext } from '../../Contexts/chat.context';
import { UsersList } from '../UsersList/UsersList';
import { Messages } from '../Messages/Messages';
import { Textbox } from '../Textbox/Textbox';

const Home = () => {
    const { currentUser } = useContext(UserContext);
    const { sendMessage, connection } = useContext(ChatContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser == null)
            navigate("/");
    }, [currentUser, navigate]);

    const onSendMessage = (message: string) => {
        message !== '' && sendMessage(currentUser?.id ?? 'Anonymous', message);
    };

    return (<>
        {currentUser &&
            <>
                <div className='w-100 m-auto form-signin'>
                    <img src={currentUser.avatarUrl} alt={"User profile"} className="rounded img-fluid img-thumbnail" referrerPolicy='no-referrer' />
                    <p className='w-100 m-auto'>{currentUser.fullName}</p>
                    <p className='w-100 m-auto'>{currentUser.email}</p>
                    <p className='w-100 m-auto'>{connection?.connectionId}</p>
                    <button onClick={logoutFirebase} className='btn-lg btn btn-secondary w-100 m-auto'>Logout</button>
                </div>
                <section style={{ backgroundColor: "#CDC4F9" }}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card" id="chat3" style={{ borderRadius: "15px" }}>
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
                                                <Textbox key={'textBox'} onSendMessage={(message) => onSendMessage(message)}/>
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