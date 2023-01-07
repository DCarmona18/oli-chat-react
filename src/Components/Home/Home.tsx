import './Home.css';
import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutFirebase } from '../../Utils/firebase.utils';
import { UserContext } from '../../Contexts/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import PerfectScrollbar from 'react-perfect-scrollbar'

const Home = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const chatListElement = useRef<HTMLElement>();
    const chatActiveElement = useRef<HTMLElement>();


    useEffect(() => {
        if (currentUser == null)
            navigate("/login");
    }, [currentUser, navigate]);

    const onSendMessage = (e: any) => {
        
    };

    const onNewMessage = (e: any) => {
        
    };

    const scrollChatlist = () => {
        const curr = chatListElement.current;
        if (curr) {
            curr.scrollTo({
                top: 0
            });
        }
    };

    const scrollActiveChat = () => {
        const curr = chatActiveElement.current;
        if (curr) {
            curr.scrollTo({ top: curr.scrollHeight });
        }
    };
    return (<>
        {currentUser &&
            <>
                <div className='w-100 m-auto form-signin'>
                    <img src={currentUser.avatarUrl} alt={"User profile"} className="rounded img-fluid img-thumbnail" referrerPolicy='no-referrer' />
                    <p className='w-100 m-auto'>{currentUser.fullName}</p>
                    <p className='w-100 m-auto'>{currentUser.email}</p>
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
                                                    <PerfectScrollbar containerRef={el => (chatListElement.current = el)}>
                                                        <div style={{ position: "relative", height: "400px" }}>
                                                            {/* Chat list left */}
                                                            <ul className="list-unstyled mb-0">
                                                                <li className="p-2 border-bottom">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-success badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Marie Horwitz</p>
                                                                                <p className="small text-muted">Hello, Are you there?</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">Just now</p>
                                                                            <span className="badge bg-danger rounded-pill float-end">3</span>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <li className="p-2 border-bottom">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-warning badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Alexa Chung</p>
                                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">5 mins ago</p>
                                                                            <span className="badge bg-danger rounded-pill float-end">2</span>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <li className="p-2 border-bottom">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-success badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Danny McChain</p>
                                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">Yesterday</p>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <li className="p-2 border-bottom">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-danger badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Ashley Olsen</p>
                                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">Yesterday</p>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <li className="p-2 border-bottom">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-warning badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Kate Moss</p>
                                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">Yesterday</p>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <li className="p-2">
                                                                    <a href="#!" className="d-flex justify-content-between text-decoration-none">
                                                                        <div className="d-flex flex-row">
                                                                            <div>
                                                                                <img
                                                                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                                                    alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                                <span className="badge bg-success badge-dot"></span>
                                                                            </div>
                                                                            <div className="pt-1">
                                                                                <p className="fw-bold mb-0 text-start">Ben Smith</p>
                                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="small text-muted mb-1">Yesterday</p>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </PerfectScrollbar>

                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-7 col-xl-8">
                                                <div className="pt-3 pe-3" style={{ position: "relative", height: "400px" }}>
                                                    <PerfectScrollbar containerRef={el => (chatActiveElement.current = el)}>
                                                        {/* Received msg */}
                                                        <div className="d-flex flex-row justify-content-start">
                                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                                alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                                            <div>
                                                                <p className="small p-2 ms-3 mb-1 rounded-3 text-start" style={{ backgroundColor: "#f5f6f7" }}>Lorem ipsum
                                                                    dolor
                                                                    sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                                                    dolore
                                                                    magna aliqua.</p>
                                                                <p className="small ms-3 mb-3 rounded-3 text-muted float-end">12:00 PM | Aug 13</p>
                                                            </div>
                                                        </div>
                                                        {/* Sending msg */}
                                                        <div className="d-flex flex-row justify-content-end">
                                                            <div>
                                                                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary text-start">Ut enim ad minim veniam,
                                                                    quis
                                                                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                                                <p className="small me-3 mb-3 rounded-3 text-muted text-start">12:00 PM | Aug 13</p>
                                                            </div>
                                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                                alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                                        </div>
                                                    </PerfectScrollbar>
                                                </div>

                                                <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                                    <a className="ms-1 text-muted" href="#!"><FontAwesomeIcon icon={faPaperclip} /></a>
                                                    <a className="ms-3 text-muted" href="#!"><FontAwesomeIcon icon={faSmile} /><i className="fas fa-smile"></i></a>
                                                    <input type="text" className="form-control form-control-lg" id="exampleFormControlInput2"
                                                        placeholder="Type message" />
                                                    <a className="ms-3" onClick={onSendMessage} href="#!"><FontAwesomeIcon icon={faPaperPlane} /></a>
                                                </div>

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