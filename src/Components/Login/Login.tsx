import { useContext } from 'react';
import { UserContext } from '../../Contexts/user.context';
import { getCurrentUser, signInWithGooglePopup } from '../../Utils/firebase.utils';
import './Login.css';

const Login = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const onFormSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        alert('Not implemented');
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithGooglePopup();
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-disabled':
                    alert('User disabled');
                    break;

                default:
                    alert('Error in application.')
                    console.error(error);
                    break;
            }
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <>
            <div className="text-center sign-in-container">
                {currentUser &&
                    <div className='w-100 m-auto form-signin'>
                        <img src={currentUser.avatar} className="rounded img-fluid img-thumbnail" referrerPolicy='no-referrer' />
                        <p className='w-100 m-auto'>{currentUser.name}</p>
                        <p className='w-100 m-auto'>{currentUser.email}</p>
                        <button onClick={logout} className='btn-lg btn btn-secondary w-100 m-auto'>Logout</button>
                    </div>
                }
                {!currentUser &&
                    <main className="form-signin w-100 m-auto">
                        <form>
                            <img className="mb-4" src="/img/logo.svg" alt="" width="72" height="57" />
                            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                            <div className="form-floating">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>

                            <div className="checkbox mb-3">
                                <label>
                                    <input type="checkbox" value="remember-me" /> Remember me
                                </label>
                            </div>
                            <button className="w-100 btn btn-lg btn-success" onClick={onFormSubmit} type="submit">Sign in</button>
                        </form>
                        <hr />
                        <div className='w-100 m-auto'>
                            <button className="btn btn-primary" onClick={signInWithGoogle}>Sign in with google</button>
                        </div>
                    </main>
                }
            </div>

        </>
    )
};

export default Login;