import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/context/Authcontext';


const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const values = {email,password};
  const {login} = useAuth();


  // Frontend - LoginForm
const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault();

  

  if (!email || !password) {
    setError('Please fill out all fields.');
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Ensure user.id exists in the response
    console.log('User ID:', data.user.id); // Check the id value
    localStorage.setItem('userId', data.user.id); // Store in localStorage

    login(data.user);

  } catch (error: unknown) {
    console.error("Login error:", error);
    let errorMessage = "Login failed. Please check your email and password.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  }
};

  








  return (
    <div
      className="flex h-screen ps-10 items-center justify-start bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)',
      }}
    >
      <div className="bg-b386537a bg-opacity-75 p-6 md:p-8 rounded-lg shadow-lg max-w-xs md:max-w-sm w-full transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center animate-fadeIn">
          <span className="text-white">Barefoot</span>{' '}
          <span className="text-yellow-600">Arthemis</span>
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition transform duration-300 ease-in-out hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Don&apos;t have an account?{' '}
          <Link href="/RegisterForm" className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out">
            Sign up
          </Link>
        </p>

      
      </div>
    </div>
  );
};

export default LoginForm;
