import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { ChatProvider } from '../../Contexts/chat.context';
import './Navigation.css';

export const Navigation = () => {
    return (
        <Fragment>
            <div>Navigation Bar</div>
            <ChatProvider>
                <Outlet />
            </ChatProvider>
        </Fragment>
    );
};