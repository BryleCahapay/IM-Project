import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Added confirmPassword state
    const [username, setUsername] = useState<string>(''); // Added username state
    const [error, setError] = useState<string>('');
    const [successMessage] = useState<string>(''); // Not used but retained
    const values = { email, password, username};

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if all fields are filled and passwords match
        if (!email || !password || !confirmPassword || !username) {
            setError('Please fill out all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            router.push('/');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please check your details.');
        }
    };

    return (
        <div
            className="flex justify-start items-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)',
            }}
        >
            <div className="bg-transparent p-6 md:p-8 rounded-lg shadow-lg max-w-xs md:max-w-sm w-full mx-auto ml-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    <span className="text-white">Barefoot</span>{' '}
                    <span className="text-yellow-600">Arthemis</span>
                </h1>
                <div className="p-2 bg-opacity-50 rounded-lg">
                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && (
                        <p className="font-bold text-white mt-4">{successMessage}</p>
                    )}
                    <form onSubmit={handleRegister}>
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
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2">Username:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2">Password:</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-white text-sm font-bold mb-2">Confirm Password:</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-4 text-center text-white">
                        Already have an account?{' '}
                        <Link href="/LoginForm" className="text-yellow-500 hover:text-yellow-600">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
