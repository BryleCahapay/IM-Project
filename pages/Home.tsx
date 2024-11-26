import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/Authcontext'; // Make sure to adjust the import path
import { useRouter } from 'next/router'; // Add this import

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Destructure values from AuthContext
  const router = useRouter(); // Initialize the router

  // Redirect user to LoginPage if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/LoginForm');
    }
  }, [isAuthenticated, router]);

  return (
    <div
      className="flex flex-col h-screen px-6 py-12 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)' }}
    >
      <div className="absolute top-8 left-8">
        <h1 className="text-5xl font-bold">
          <span className="text-white">Barefoot</span>{' '}
          <span className="text-yellow-600">Arthemis</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-center bg-b386537a bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-3xl mt-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="text-white rounded-s-lg" style={{ backgroundColor: '#b386537a' }}>
              Barefoot Arthemis
            </span>
          </h2>
          <p className="text-lg text-gray-200">
            Discover the finest selection of nutritious pet foods <br />
            to keep your furry friends happy and healthy!
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-12 mb-12 w-full">
        <Link
          href="/LandingPage" // Navigate to LandingPage when clicked
          className="bg-yellow-600 text-white font-bold py-4 px-12 rounded-lg hover:bg-yellow-700 transition duration-300"
        >
          SHOP NOW
        </Link>
      </div>

      {/* Contact Us Section */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-800 text-white py-1">
        <div className="text-center text-sm">
          For inquiries, contact us: <span className="font-bold">09361251763</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
