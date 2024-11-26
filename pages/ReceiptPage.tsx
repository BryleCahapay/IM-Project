import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
}

const Receipt: React.FC = () => {
  const router = useRouter();
  const { paymentMethod, cartItems, totalAmount, address, contactNumber, email } = router.query;

  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parsedCartItems: CartItem[] =
    typeof cartItems === 'string' ? JSON.parse(cartItems) : [];

  const [userEmail] = useState<string | undefined>(email as string);

  // Use ref to track if the receipt has already been saved
  const receiptSaved = useRef(false);

  // Function to save the receipt to the database
  const saveReceipt = async () => {
    const receiptData = {
      paymentMethod,
      cartItems: parsedCartItems,
      totalAmount,
      address,
      contactNumber,
      orderDate,
      email,  // Use the email from state or query
    };

    try {
      const response = await fetch('/api/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Receipt saved:', data.message);
      } else {
        console.error('Failed to save receipt:', data.message);
      }
    } catch (error) {
      console.error('Error sending receipt:', error);
    }
  };

  useEffect(() => {
    // Check if receipt has already been saved
    if (paymentMethod && cartItems && totalAmount && !receiptSaved.current) {
      saveReceipt();
      receiptSaved.current = true;  // Mark as saved
    }
  }, [paymentMethod, cartItems, totalAmount]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)',
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-2xl max-w-md w-full mx-6 border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
          Receipt
        </h1>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Payment Method: <span className="text-gray-900">{paymentMethod ?? 'N/A'}</span>
        </h2>

        <h2 className="text-md text-gray-600 mb-4">Order Date: {orderDate}</h2>


        <h2 className="text-lg text-gray-700 font-semibold mb-4">Selected Items</h2>
        {parsedCartItems.length > 0 ? (
          <>
            <ul className="space-y-2 text-gray-700">
              {parsedCartItems.map((item: CartItem, index) => (
                <li key={`${item.id || index}-${item.name}`} className="flex justify-between border-b border-gray-200 pb-2">
                  <span>{item.name}</span>
                  <span>₱ {item.price}</span>
                </li>
              ))}
            </ul>
            <hr className="my-4 border-t border-gray-300" />
          </>
        ) : (
          <p className="text-gray-500">No items selected.</p>
        )}

        {totalAmount && (
          <div className="flex justify-between text-xl font-bold text-gray-800 mt-4">
            <span>Total Amount:</span>
            <span>₱ {totalAmount}</span>
          </div>
        )}

        {(address || contactNumber) && (
          <div className="mt-4 font-medium text-gray-700">
            {address && <p className="mb-2"><strong>Address:</strong> {address}</p>}
            {contactNumber && <p><strong>Contact Number:</strong> {contactNumber}</p>}
          </div>
        )}

        {userEmail && (
          <div className="mt-4 font-medium text-gray-700">
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-800">Thank You!!</p>
        </div>

        <button
          onClick={() => router.push('/LandingPage')}
          className="mt-6 w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-300 ease-in-out"
        >
          Shop again
        </button>
      </div>
    </div>
  );
};

export default Receipt;
