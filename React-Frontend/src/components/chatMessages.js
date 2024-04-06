// File: components/ChatMessages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../contant/baseUrl';

function ChatMessages({ chatId, renderAsJSON = false }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${baseUrl}message/findAllByChatId/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  return (
    <div>
      <h1>{`Render Messages for Chat ID = ${chatId} Here as ${renderAsJSON ? 'JSON' : 'HTML'}`}</h1>
      {renderAsJSON ? (
        <pre>{JSON.stringify(messages, null, 2)}</pre>
      ) : (
        <div>
          {messages?.map((message, index) => 
            <p key={index} style={{ marginBottom: '20px' }}>
              <strong>Message ID: {message.messageId}</strong><br/>
              {message.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessages;