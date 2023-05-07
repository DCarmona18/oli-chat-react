import { Outlet } from 'react-router-dom';
import { ChatProvider } from '../../Contexts/chat.context';
import './Navigation.css';

export const Navigation = () => {
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col">
                    <ChatProvider>
                        <Outlet />
                    </ChatProvider>
                </div>
            </div>
        </div>
    );
};