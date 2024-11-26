import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/Authcontext'; // Assuming this is your custom auth hook

type ReceiptItem = {
  paymentMethod: string;
  cartItems: string[]; // Items in the receipt
  totalAmount: string;
  address: string;
  contactNumber: string;
  orderDate: string;
  email: string;
};

const Profile = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth(); // Assuming your custom hook provides authentication state
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]); // For storing receipt history
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/Profile');
      return;
    }

    if (user) {
      setEmail(user.email);
      setUsername(user.username || '');

      // Fetch receipt data based on email
      const fetchReceipts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/receipt?email=${user.email}`);
          if (!response.ok) {
            throw new Error('...');
          }
          const data = await response.json();
          setReceipts(data.cartItems); // Assuming the API returns an array of receipts
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || 'An error occurred while fetching data');
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchReceipts();
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="text-black bg-gradient-to-r from-[#8a6344] to-white min-h-screen p-8 flex flex-col items-center space-y-8">
      {/* User Profile Section */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">User Profile</h1>
        {/* Email */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none cursor-not-allowed"
          />
        </div>
        {/* Username */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Username:</label>
          <input
            type="text"
            value={username}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none cursor-not-allowed"
          />
        </div>
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => router.push('/LandingPage')}
            className="px-6 py-3 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Cart List and Receipt Summary Section (Responsive Grid Layout) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Receipt Summary Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Receipt Summary</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : receipts.length > 0 ? (
            <ul>
              {receipts.map((receipt, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-lg font-bold">{`Order on ${receipt.orderDate}`}</h3>
                  <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
                  <p><strong>Items:</strong> {receipt.cartItems.join(', ')}</p>
                  <p><strong>Total Amount:</strong> ₱ {receipt.totalAmount}</p>
                  <p><strong>Address:</strong> {receipt.address}</p>
                  <p><strong>Contact Number:</strong> {receipt.contactNumber}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No receipts found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
