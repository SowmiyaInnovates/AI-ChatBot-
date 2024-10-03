// ChatBot.js
import React, { useState } from 'react';
import axios from 'axios';  // Import axios for API calls
import './ChatBot.css';

const ChatBot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return; // Prevent empty messages
        
        const userChat = { user: userMessage, bot: "" };
        setChatHistory([...chatHistory, userChat]);
        setUserMessage('');
        setIsLoading(true); // Start loading when message is sent

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4', // Specify the model
                    messages: [{ role: 'user', content: userMessage }],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Access your API key from .env
                    },
                }
            );

            const botResponse = response.data.choices[0].message.content;
            setChatHistory((prev) => {
                const updatedChat = [...prev];
                updatedChat[updatedChat.length - 1].bot = botResponse;
                return updatedChat;
            });
        } catch (error) {
            console.error('Error communicating with OpenAI API', error);
            setChatHistory((prev) => {
                const updatedChat = [...prev];
                updatedChat[updatedChat.length - 1].bot = "Sorry, something went wrong. Please try again.";
                return updatedChat;
            });
        } finally {
            setIsLoading(false); // Stop loading once done
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">Chatbot</div>
            <div className="chatbot-messages">
                {chatHistory.map((chat, index) => (
                    <div key={index} className="message">
                        <div className="user-message">{chat.user}</div>
                        {chat.bot && <div className="bot-message">{chat.bot}</div>} {/* Show bot message only if it exists */}
                    </div>
                ))}
                {isLoading && <div className="loading">AI is typing...</div>} {/* Loading indicator */}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
