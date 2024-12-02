import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Removed FaTimes as it is not needed here
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '@/context/Authcontext';

interface PetFoodItem {
  name: string;
  price: number;
  imageUrl: string;
  quantity?: number; 
  isChecked?: boolean;
}


const LandingPage = () => {
  const [cartItems, setCartItems] = useState<PetFoodItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false); // Modal state
  
  const router = useRouter();

  // Retrieve the authentication status and email from the AuthContext
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load cart items and count from localStorage
    const storedCart = localStorage.getItem('cartItems');

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      setCartCount(parsedCart.length); // Sync cart count with the number of items
    } else {
      localStorage.setItem('cartItems', JSON.stringify([]));
      localStorage.setItem('cartCount', '0');
    }
  }, []);

  const handleProfileClick = () => {
    router.push('/Profile');
  };

  const addToCart = async (item: PetFoodItem) => {
    try {
      // Check stock before adding the item to the cart
      const response = await fetch('/api/check-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: item.name,
          quantity: 1, // Always checking for 1 item since it's a new addition
        }),
      });
      setCartCount(cartCount + 1);
      const stockData = await response.json();
  
      if (!stockData.success) {
        alert(stockData.message || 'Sorry, this item is out of stock.');
        return; // Exit if stock is insufficient
      }
  
      // Stock is sufficient; proceed to add the item to the cart
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const customerId = user.customer_id;
      const email = user.email;
  
      // Send updated cart item to the database
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          quantity: 1, // Increment quantity by 1
          customer_id: customerId,
          email, // Replace with the actual user ID
        }),
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding this item to your cart.');
    }
  };
  

  
  

  const handleCartClick = () => {
    router.push({
      pathname: '/CartPage',
      query: { cartItems: JSON.stringify(cartItems) },
    });
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const handleLogoutConfirm = () => {
    // Clear cart and user session
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartCount');
    setCartItems([]);
    setCartCount(0);
    router.push('/LoginForm');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // Close the modal if user cancels
  };

  const dogFoodItems: PetFoodItem[] = [
    {
      name: 'Whooppy',
      price: 75,
      imageUrl: '/images/Whooppy.jpg',
    },
    {
      name: 'Nutrichunks',
      price: 135,
      imageUrl: '/images/nutrichunks.jpg',
    },
    {
      name: 'Aozi dog',
      price: 165,
      imageUrl: '/images/Aozi.jpg',
    },
    {
      name: 'Pedigree',
      price: 135,
      imageUrl: '/images/Pedigree.jpg',
    },
    {
      name: 'Vitality High energy',
      price: 180,
      imageUrl: '/images/VitalityHighEnergy.jpg',
    },
  ];

  const catFoodItems: PetFoodItem[] = [
    {
      name: 'Tomi',
      price: 110,
      imageUrl: '/images/Tomi.jpg',
    },
    {
      name: 'Nutricare tuna',
      price: 125,
      imageUrl: '/images/TunaFlavorNutriCare.jpg',
    },
    {
      name: 'Whiskas Ocean fish',
      price: 165,
      imageUrl: '/images/WhiskasOceanFish.jpg',
    },
    {
      name: 'Aozi Cat',
      price: 170,
      imageUrl: '/images/AoziCatFood.jpeg',
    },
    {
      name: 'Princess',
      price: 150,
      imageUrl: '/images/princesscat20kg.jpg',
    },
  ];

  const mixedItems: PetFoodItem[] = [
    {
      name: 'Nutricare salmon',
      price: 125,
      imageUrl: '/images/SalmonFlavorNutriCare.jpeg',
    },
    {
      name: 'Vitality Value Meal',
      price: 135,
      imageUrl: '/images/VitalityValueMeal.jpg',
    },
    {
      name: 'My Cat',
      price: 145,
      imageUrl: '/images/Mycart.jpg',
    },
    {
      name: 'Azu',
      price: 165,
      imageUrl: '/images/AzuDentalBites.jpg',
    },
    {
      name: 'Whiskas tuna',
      price: 165,
      imageUrl: '/images/WhiskasTunaFlavour.jpg',
    },
  ];

  const allPetFoodItems: PetFoodItem[] = [...dogFoodItems, ...catFoodItems, ...mixedItems];

  return (
    <div className="bg-gradient-to-r from-brown-700 via-brown-500 to-white min-h-screen">
      {/* Fixed Header */}
      <header className="w-full fixed top-0 left-0 z-10 bg-brown-800 p-4 sm:p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-white">Barefoot</span>{' '}
            <span className="text-yellow-500">Arthemis</span>
          </h1>
          <nav className="hidden lg:flex space-x-4 sm:space-x-8 items-center">
            <Link href="/Home">
              <span className="font-bold text-yellow-400 text-lg sm:text-2xl hover:text-white cursor-pointer">
                Home
              </span>
            </Link>
            
            <Link href="/Home">
              <span className="font-bold text-yellow-400 text-lg sm:text-2xl hover:text-white cursor-pointer">
                Contact
              </span>
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button className="text-yellow-600 p-2 rounded" onClick={handleProfileClick}>
                <FaUserCircle size={30} />
              </button>
            ) : (
              <Link href="/LoginForm">
                <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 transition duration-300">
                  Login
                </button>
              </Link>
            )}
            <button
              className="relative text-yellow-600 p-2 rounded"
              onClick={handleCartClick}
            >
              <FaShoppingCart size={30} />
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                {cartCount > 0 ? cartCount : 0}
              </span>
            </button>

            {isAuthenticated && (
              <button
                className="text-yellow-600 p-2 rounded sm:block"
                onClick={handleLogoutClick}
              >
                <FaSignOutAlt size={30} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 bg-orange-500 bg-opacity-30 w-full p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg max-w-full sm:max-w-none mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {allPetFoodItems.map((item, index) => (
            <div key={index} className="border bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={400} // Adjust width as needed
                height={400} // Adjust height as needed
                className="w-full h-48 sm:h-64 lg:h-72 object-cover mb-2 rounded"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-lg sm:text-xl text-gray-600">₱ {item.price}</p>
              <button
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 transition duration-300"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-around">
              <button
                className="bg-red-300 text-black px-6 py-2 rounded hover:bg-red-500"
                onClick={handleLogoutConfirm}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-200"
                onClick={handleLogoutCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
