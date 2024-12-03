import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/Authcontext';

interface PetFood {
  id: number;
  name: string;
  price: number;
  onHand: number;
}

const AdminPetFood = () => {
  const [petFoods, setPetFoods] = useState<PetFood[]>([]);
  const [editingFood, setEditingFood] = useState<PetFood | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState(false); // Track if there's an error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const { isAuthenticated, user } = useAuth();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!user) {
      router.push('/LoginForm');
    } else if (user?.role !== 'admin') {
      router.push('/Home'); // Redirect non-admin users
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchPetFoods = async () => {
      const response = await fetch('/api/petFoods', {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setPetFoods(data);
      } else {
        console.error('Failed to fetch pet foods');
      }
    };

    fetchPetFoods();
  }, []);

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    setShowConfirmation(false);
    router.push('/LoginForm');
  };

  const handleLogoutCancel = () => {
    setShowConfirmation(false);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingFood) {
      try {
        const response = await fetch(`/api/petFoods?id=${editingFood.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFood),
        });

        if (response.ok) {
          setPetFoods((prevFoods) =>
            prevFoods.map((item) => (item.id === editingFood.id ? editingFood : item))
          );
          setEditingFood(null);
          setShowConfirmation(false);
        } else {
          throw new Error('Failed to update pet food');
        }
      } catch {
        setErrorMessage('There was an error updating the pet food. Please try again.');
        setShowError(true); // Show error message
      }
    }
  };

  const handleRetrySubmit = async () => {
    if (editingFood) {
      try {
        const response = await fetch(`/api/petFoods/${editingFood.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFood),
        });

        if (response.ok) {
          setPetFoods((prevFoods) =>
            prevFoods.map((item) => (item.id === editingFood.id ? editingFood : item))
          );
          setEditingFood(null);
          setShowError(false); // Hide error message if retry is successful
        } else {
          setErrorMessage('Failed to update pet food again. Please try again later.');
        }
      } catch {
        setErrorMessage('There was an error retrying the update. Please try again.');
      }
    }
  };

  const handleEdit = (food: PetFood) => {
    setEditingFood(food);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
        <nav className="mt-4">
          <Link href="/AdminPage" className="block py-2 px-4 bg-blue-600">Pet Food Management</Link>
          <Link href="/AdminOrder" className="block py-2 px-4 hover:bg-blue-500">Order List</Link>
          <button onClick={() => router.push('/OrderHistory')} className="block py-2 px-4 hover:bg-blue-500">Order History</button>
          <button onClick={handleLogout} className="block mt-4 py-2 px-4 w-full text-left hover:bg-red-600">Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-auto">
        <h1 className="text-2xl text-black font-bold mb-4">Pet Food Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-black border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">On Hand</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {petFoods.map((food) => (
                <tr key={food.id}>
                  <td className="border border-gray-300 p-2">{food.id}</td>
                  <td className="border border-gray-300 p-2">{food.name}</td>
                  <td className="border border-gray-300 p-2">₱ {food.price}</td>
                  <td className="border border-gray-300 p-2">{food.onHand}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => handleEdit(food)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingFood && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleEditSubmit} className="bg-white text-black p-4 rounded shadow-md">
              <h2 className="text-xl mb-2">Edit Pet Food</h2>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="id">ID</label>
                <input
                  type="text"
                  name="id"
                  value={editingFood.id}
                  readOnly
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingFood.name}
                  onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingFood.price}
                  onChange={(e) => setEditingFood({ ...editingFood, price: Number(e.target.value) })}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="onHand">On Hand</label>
                <input
                  type="number"
                  name="onHand"
                  value={editingFood.onHand}
                  onChange={(e) => setEditingFood({ ...editingFood, onHand: Number(e.target.value) })}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
              <button type="button" onClick={() => setEditingFood(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">Cancel</button>
            </form>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-4 rounded shadow-md">
              <h2 className="text-xl mb-4">Are you sure you want to log out?</h2>
              <div className="flex justify-between">
                <button
                  onClick={handleLogoutConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={handleLogoutCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && errorMessage && (
          <div className="text-red-600 mt-4">{errorMessage}</div>
        )}

        {/* Retry button for failed submission */}
        {showError && (
          <button
            onClick={handleRetrySubmit}
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 hover:bg-yellow-600"
          >
            Retry
          </button>
        )}
      </main>
    </div>
  );
};

export default AdminPetFood;
