import { useState } from 'react';
import { useRouter } from 'next/router';

const AdminForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    // Simulate admin authentication check (replace with real authentication logic)
    if (email === 'admin@gmail.com' && password === 'password') {
      alert('Admin login successful!');
      router.push('/AdminPage'); // Redirect to the Admin Page
    } else {
      setError('Invalid admin email or password.');
    }
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div
      className="flex h-screen ps-10 items-center justify-start bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)',
      }}
    >
      <div className="bg-b386537a bg-opacity-75 p-6 md:p-8 rounded-lg shadow-lg max-w-xs md:max-w-sm w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-white">Admin</span>{' '}
          <span className="text-yellow-600">Login</span>
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition mb-4"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleBack}
          className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AdminForm;
