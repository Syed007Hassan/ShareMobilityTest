import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessageDetails({ messageId }) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/message/findAll/${messageId}`);
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchMessage();
  }, [messageId]);

  return (
<div>
      <h1>{`Echo Message ID = ${messageId} Here as HTML`}</h1>
      {message && Object.keys(message).map((key, index) => (
        <p key={index}>
          <strong>{`${key}: `}</strong>{message[key]}
        </p>
      ))}
    </div>
  );
}

export default MessageDetails;