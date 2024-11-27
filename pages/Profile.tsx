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

type CartItem = {
  item_name: string;
  price: string;
  quantity: number;
};

const Profile = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth(); // Assuming your custom hook provides authentication state
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]); // For storing receipt history
  const [cartList, setCartList] = useState<CartItem[]>([]); // For storing cart items
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
            throw new Error('Failed to fetch receipts.');
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

      const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/cartlist?email=${user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch cart items.');
          }
          const data = await response.json();
          setCartList(data); // Set the cart items fetched from the API
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
      fetchCartItems();
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="text-black bg-gradient-to-r from-[#8a6344] to-white min-h-screen p-4 flex justify-between items-start space-x-6">
      {/* User Profile Section */}
      <div className="w-1/3 bg-white shadow rounded-lg p-4">
        <h1 className="text-xl font-bold text-blue-900 mb-4">User Profile</h1>
        {/* Email and Username in same row */}
        <div className="flex space-x-4 mb-4">
          {/* Email */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none cursor-not-allowed"
            />
          </div>
          {/* Username */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push('/LandingPage')}
          className="w-full px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Back to Home
        </button>
      </div>

      {/* Receipt Summary Section */}
      <div className="w-2/3 max-w-3xl bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Receipt Summary</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : receipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Order Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Items</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Total (₱)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Address</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Contact</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.orderDate}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.paymentMethod}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.cartItems.join(', ')}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.totalAmount}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.address}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{receipt.contactNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No receipts found.</p>
        )}
      </div>

      {/* Cart List Section */}
      <div className="w-2/3 max-w-3xl bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Cart List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cartList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Product Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Price (₱)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((item, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.price}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
