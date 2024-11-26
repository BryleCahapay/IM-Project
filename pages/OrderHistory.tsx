// components/OrderHistory.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Order {
  id: number;
  payment_method: string;
  order_date: string;
  cart_items: string; // Assuming this is a JSON string or a simple list. Adjust as needed.
  total_amount: number;
  address: string;
  contact_number: string;
  email: string;
  status: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Array to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orderlist'); // API endpoint to fetch the order list
        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Set orders in state
        } else {
          console.error('Error fetching orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this will run once when the component mounts

  // Logout handler
  const handleLogout = () => {
    router.push('/LoginForm');
  };

  // Navigate to the admin page
  const handleNavigateToAdminPage = () => {
    router.push('/AdminPage');
  };

  // Show a loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
        <nav className="mt-4">
          <button
            onClick={handleNavigateToAdminPage}
            className="block py-2 px-4 w-full text-left hover:bg-blue-500"
          >
            Pet Food Management
          </button>
          <Link href="/AdminOrder" className="block py-2 px-4 hover:bg-blue-500">
            Order List
          </Link>

          <Link href="/OrderHistory" className="block py-2 px-4 bg-blue-600">
            Order History
          </Link>
          <button
            onClick={handleLogout}
            className="block mt-4 py-2 px-4 w-full text-left hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-auto">
        <h1 className="text-2xl text-black font-bold mb-4">Order History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full text-black border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Payment Method</th>
                <th className="border border-gray-300 p-2">Order Date</th>
                <th className="border border-gray-300 p-2">Cart Items</th>
                <th className="border border-gray-300 p-2">Total Amount</th>
                <th className="border border-gray-300 p-2">Address</th>
                <th className="border border-gray-300 p-2">Contact Number</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{order.id}</td>
                    <td className="border border-gray-300 p-2">{order.payment_method}</td>
                    <td className="border border-gray-300 p-2">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="border border-gray-300 p-2">{order.cart_items}</td>
                    <td className="border border-gray-300 p-2">₱ {order.total_amount}</td>
                    <td className="border border-gray-300 p-2">{order.address}</td>
                    <td className="border border-gray-300 p-2">{order.contact_number}</td>
                    <td className="border border-gray-300 p-2">{order.email}</td>
                    <td className="border border-gray-300 p-2">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center p-4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
