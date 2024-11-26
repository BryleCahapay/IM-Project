import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Order {
  id: string;
  email: string;
  total_amount: number;
  order_date: string;
  status: string;
}

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/receipts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.receipts);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async () => {
    if (orderToDelete) {
      try {
        const response = await fetch(`/api/deleteOrder?id=${orderToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderToDelete)
          );
          setIsModalOpen(false);
        } else {
          console.error('Failed to delete the order.');
        }
      } catch (error) {
        console.error('Error deleting the order:', error);
      }
    }
  };

  const handleOpenModal = (id: string) => {
    setOrderToDelete(id);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    router.push('/LoginForm');
  };

  const handleNavigateToPetFood = () => {
    router.push('/AdminPage');
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/updateOrderStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
  
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: status } : order
          )
        );
        console.log(`Order ${id} updated to status: ${status}`);
      } else {
        console.error('Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
        <nav className="mt-4">
          <button
            onClick={handleNavigateToPetFood}
            className="block py-2 px-4 w-full text-left hover:bg-blue-500"
          >
            Pet Food Management
          </button>
          <Link href="/AdminOrder" className="block py-2 px-4 bg-blue-600">
            Order List
          </Link>
          <Link href="/OrderHistory" className="block py-2 px-4 hover:bg-blue-500">
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
        <h1 className="text-2xl text-black font-bold mb-4">Order Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full text-black border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Total Amount</th>
                <th className="border border-gray-300 p-2">Order Date</th>
                <th className="border border-gray-300 p-2">Actions</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-orange-500">
                    No orders available.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 p-2">{order.id}</td>
                    <td className="border border-gray-300 p-2">{order.email}</td>
                    <td className="border border-gray-300 p-2">
                      ₱ {order.total_amount}
                    </td>
                    <td className="border border-gray-300 p-2">{order.order_date}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleOpenModal(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.status === 'Pending' || order.status === null ? (
                        <div className="flex items-center space-x-2">
                          {/* Orange Circle */}
                          <span className="w-6 h-6 rounded-full bg-orange-500 inline-block"></span>
                          <button
                            onClick={() => handleStatusChange(order.id, 'Completed')}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {/* Green Circle */}
                          <span className="w-6 h-6 rounded-full bg-green-500 inline-block"></span>
                          <span className="text-green-700 font-semibold">Completed</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white text-black p-6 rounded shadow-md w-80">
              <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
              <p>Are you sure you want to delete this order?</p>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrder;
