"use client"

import { useEffect, useState } from 'react';
import Logout from '../../../components/Logout/Logout'

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/parseJWT');
      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <p>Email: {user.email}</p>
      <p><Logout/></p>
    </div>
  );
}