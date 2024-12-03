import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/Authcontext';

type ReceiptItem = {
  paymentMethod: string;
  cartItems: string[]; // Array of strings, each item being a cart item name
  totalAmount: string;
  address: string;
  contactNumber: string;
  orderDate: string;
  email: string;
};

const Profile = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
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

      const fetchReceipts = async () => {
        setLoading(true);
        setError(null);
        try {
          // Make sure to call the correct API route with the user email
          const response = await fetch(`/api/receipt?email=${user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch receipts.');
          }
          const data = await response.json();
          // Assuming the API returns an array of receipts
          setReceipts(data.cartItems || []); 
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
    <div className="bg-gradient-to-r from-[#8a6344] to-white min-h-screen p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
      {/* User Profile Section */}
      <div className="w-full md:w-1/4 bg-white shadow rounded-lg p-3">
        <h1 className="text-xl font-semibold text-[#2C3E50] mb-3">User Profile</h1>
        <div className="grid grid-cols-1 gap-3">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none cursor-not-allowed"
            />
          </div>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full p-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/LandingPage')}
          className="w-full px-4 py-2 bg-[#FF8C00] text-white font-semibold rounded-lg shadow hover:bg-[#e67e22] focus:outline-none mt-3"
        >
          Back to Home
        </button>
      </div>

      {/* Receipt Summary Section */}
      <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Receipt Summary</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : receipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {['Order Date', 'Payment', 'Items', 'Total (₱)', 'Address', 'Contact'].map((heading, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">{receipt.orderDate}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">{receipt.paymentMethod}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                      {Array.isArray(receipt.cartItems) ? receipt.cartItems.join(', ') : 'No items'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">{receipt.totalAmount}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">{receipt.address}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">{receipt.contactNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No receipt data available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
