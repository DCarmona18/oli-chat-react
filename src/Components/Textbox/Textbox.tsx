import { faPaperclip, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import './Textbox.css';

export type TextboxProps = {
    onSendMessage: (message: string) => void;
};

export const Textbox: FC<TextboxProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState<string>('');

    const sendMessage = (message: string) => {
        const messageToSend = message.trim();
        if (messageToSend === '') return;
        onSendMessage(messageToSend);
        cleanTextArea();
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            const messageToSend = message.trim();
            onSendMessage(messageToSend);
            cleanTextArea();
        }
    }

    const cleanTextArea = () => {
        setMessage('');
    };

    return (
        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
            <a className="ms-1 text-muted" href="#!"><FontAwesomeIcon icon={faPaperclip} /></a>
            <a className="ms-3 text-muted" href="#!"><FontAwesomeIcon icon={faSmile} /><i className="fas fa-smile"></i></a>
            <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} className="form-control form-control-lg" id="exampleFormControlInput2"
                placeholder="Type message" onKeyUpCapture={handleKeyPress} />
            <a className="ms-3" onClick={() => sendMessage(message)} href="#!"><FontAwesomeIcon icon={faPaperPlane} /></a>
        </div>
    );
};