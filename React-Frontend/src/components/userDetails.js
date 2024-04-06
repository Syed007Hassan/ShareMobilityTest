import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/findUserById/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <h1>{`Render User ID = ${userId} Here as JSON`}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default UserDetails;