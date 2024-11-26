import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface CartItem {
  imageUrl: string;
  name: string;
  price: number;
  quantity?: number;
  isChecked?: boolean;
}

const CartPage = () => {
  const router = useRouter();
  const cartItemsFromStorage = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [];

  const [items, setItems] = useState<CartItem[]>(cartItemsFromStorage.map((item: CartItem) => ({ ...item, quantity: 1, isChecked: false })));

  // Update cart items in localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  }, [items]);

  const handleQuantityChange = (index: number, increment: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) + increment) } // Ensure quantity is not less than 1
          : item
      )
    );
  };

  const handleCheckboxChange = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleDelete = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const totalPrice = items.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.isChecked).map(item => ({ ...item, quantity: item.quantity }));
    if (selectedItems.length > 0) {
      const totalAmount = totalPrice;
  
      localStorage.setItem('cartItems', JSON.stringify(selectedItems)); // Save selected items
  
      setItems([]); 
  
      localStorage.setItem('cartCount', '0');
  

      router.push({
        pathname: '/PaymentMethod',
        query: { cartItems: JSON.stringify(selectedItems), totalAmount: totalAmount }
      });
  
      // Optionally clear cart from localStorage after checkout
      localStorage.setItem('cartItems', JSON.stringify([]));
    } else {
      alert('Please select at least one item to check out.');
    }
  };
  




  const handleBack = () => {
    router.push('/LandingPage');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-5 bg-cover bg-center bg-fixed"
         style={{ backgroundImage: 'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)' }}>

      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 text-white z-10 bg-transparent">
        <h1 className="text-3xl md:text-5xl font-bold">
          <span className="text-white">Barefoot</span>{' '}
          <span className="text-yellow-600">Arthemis</span>
        </h1>
        <button onClick={handleBack} className="bg-[#FFB200] text-white py-2 px-4 rounded-lg hover:bg-[#FABC3F] transition duration-300 font-bold shadow-md">
          Back
        </button>
      </header>

      <div className="mt-24 w-full max-w-lg p-5 bg-opacity-80 rounded-lg shadow-lg" style={{ backgroundColor: '#FD8B51' }}>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Your Cart</h1>
        {items.length > 0 ? (
          <>
            <ul className="space-y-4">
  {items.map((item, index) => (
    <li key={item.name} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-md shadow" style={{ backgroundColor: '#ECDFCC' }}>
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={() => handleCheckboxChange(index)}
        className="mr-4"
      />
      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="mr-4 rounded object-cover" />
      <div className="flex-1 text-center md:text-left">
        <span className="font-semibold text-black text-sm md:text-base">{item.name}</span>
        <div className="text-black text-sm md:text-base">₱ {item.price}</div>
      </div>
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <button onClick={() => handleQuantityChange(index, -1)} className="bg-gray-100 p-1 rounded text-black font-bold">
          -
        </button>
        <span className="font-bold text-black">{item.quantity}</span>
        <button onClick={() => handleQuantityChange(index, 1)} className="bg-gray-100 p-1 rounded text-black font-bold">
          +
        </button>
        <button onClick={() => handleDelete(index)} className="text-red-600">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  ))}
</ul>

            <div className="flex flex-col md:flex-row justify-between items-center mt-4">
              <span className="font-bold text-xl">Total: ₱ {totalPrice}</span>
              <button onClick={handleCheckout} className="bg-[#FFB200] text-white py-2 px-4 rounded hover:bg-[#FABC3F] transition duration-300 font-bold mt-2 md:mt-0">
                CHECK OUT
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;

