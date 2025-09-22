import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setUser(null);
    }
  }, []); 

  return user;
}

export default useAuth;