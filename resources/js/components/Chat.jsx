import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configuration from '../config';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessageUser1, setNewMessageUser1] = useState('');
    const [newMessageUser2, setNewMessageUser2] = useState('');
    const messagesEndRefUser1 = useRef(null);
    const messagesEndRefUser2 = useRef(null);

    useEffect(() => {
        loadMessages();

        const channel = window.Echo.channel('chat');
        channel.listen('.sent', function(data) {
            loadMessages();
        });

        return () => {
            window.Echo.leaveChannel('chat');
        };
    }, []);

    const loadMessages = async () => {
        try {
            const response = await axios.get('/get-messages');
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessageUser1 = async () => {
        const message = `${newMessageUser1}`;
        await axios.post('/send-message', { message, username: 'User 1' });
        setNewMessageUser1('');
    };

    const sendMessageUser2 = async () => {
        const message = `${newMessageUser2}`;
        await axios.post('/send-message', { message, username: 'User 2' });
        setNewMessageUser2('');
    };

    const scrollToBottom = () => {
        if (messagesEndRefUser1.current) {
            messagesEndRefUser1.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (messagesEndRefUser2.current) {
            messagesEndRefUser2.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-box">
                <h3>User 1 Chat</h3>
                <div className="messages">
                    {messages
                        .filter(msg => msg.user === 'User 1' || msg.user === 'User 2')
                        .map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.user === 'User 1' ? 'own' : ''}`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    <div ref={messagesEndRefUser1} />
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessageUser1}
                        onChange={(e) => setNewMessageUser1(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessageUser1}>Send</button>
                </div>
            </div>
            <div className="chat-box">
                <h3>User 2 Chat</h3>
                <div className="messages">
                    {messages
                        .filter(msg => msg.user === 'User 2' || msg.user === 'User 1')
                        .map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.user === 'User 2' ? 'own' : ''}`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    <div ref={messagesEndRefUser2} />
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessageUser2}
                        onChange={(e) => setNewMessageUser2(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessageUser2}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
