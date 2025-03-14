"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User Login successful!");
        
        router.push('/auth/dashboard');
      } else {
        setErrorMessage(data.message || "Failed to Login (failed respose to re-route).");
      }
    } catch (error) {
      console.log('Login: catch error', error)
      setErrorMessage("Failed to Login (catch initiated).");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button type="submit" className="bg-blue-500 text-white px-6 py-2">Login</button>
    </form>
  );
};

export default LoginForm;
