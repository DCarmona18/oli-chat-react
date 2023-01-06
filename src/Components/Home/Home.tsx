import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Contexts/user.context';
import { logoutFirebase } from '../../Utils/firebase.utils';
import './Home.css';

const Home = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser == null)
            navigate("/login");
    }, [currentUser, navigate])
    return (<div>
        {currentUser &&
            <div className='w-100 m-auto form-signin'>
                <img src={currentUser.avatarUrl} alt={"User profile"} className="rounded img-fluid img-thumbnail" referrerPolicy='no-referrer' />
                <p className='w-100 m-auto'>{currentUser.fullName}</p>
                <p className='w-100 m-auto'>{currentUser.email}</p>
                <button onClick={logoutFirebase} className='btn-lg btn btn-secondary w-100 m-auto'>Logout</button>
            </div>
        }
    </div>)
};

export default Home