"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

const CreateUserForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User created successfully!");
        router.push('/auth/dashboard');
      } else {
        setErrorMessage(data.message || "Failed to create user.");
      }
    } catch (error) {
      setErrorMessage("Failed to create user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={25}
          className="border px-4 py-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          minLength={6}
          maxLength={50}
          className="border px-4 py-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          maxLength={30}
          className="border px-4 py-2 w-full"
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button type="submit" className="bg-blue-500 text-white px-6 py-2">Create User</button>
    </form>
  );
};

export default CreateUserForm;
