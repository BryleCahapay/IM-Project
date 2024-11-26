import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface InventoryItem {
  name: string;
  stock: number;
}

const PaymentMethod: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.cartItems) {
      const items = JSON.parse(router.query.cartItems as string) as CartItem[];
      setCartItems(items);
    } else {
      const cartItemsFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [];
      setCartItems(cartItemsFromStorage);
    }

    if (router.query.totalAmount) {
      setTotalAmount(Number(router.query.totalAmount));
    }
  }, [router.query.cartItems, router.query.totalAmount]);

  const updateInventory = async () => {
    const updatedInventory = [...inventory];

    cartItems.forEach((cartItem) => {
      const productIndex = updatedInventory.findIndex(item => item.name === cartItem.name);
      if (productIndex !== -1) {
        updatedInventory[productIndex].stock -= cartItem.quantity;
      }
    });

    setInventory(updatedInventory);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInventory),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!paymentMethod || !address || !contactNumber || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (paymentMethod === 'Gcash' && !proofOfPayment) {
      setError('Please upload proof of payment for GCash.');
      return;
    }

    setError('');
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    await updateInventory();

    try {
        const response = await fetch('/api/updateInventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartItems,
            }),
        });

        if (!response.ok) {
            throw new Error('Payment processing failed');
        }

        router.push({
            pathname: '/ReceiptPage',
            query: {
                cartItems: JSON.stringify(cartItems),
                totalAmount,
                paymentMethod,
                address,
                contactNumber,
                email,
                proofOfPayment: proofOfPayment ? proofOfPayment.name : '',
            },
        });
    } catch (error) {
        console.error('Error processing payment:', error);
    }
  };

  const handleCancelPayment = () => {
    setShowConfirmation(false);
  };

  const handleGoBack = () => {
    router.push('/CartPage');
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-2253275.jpg&fm=jpg)' }}
    >
      <div className="bg-white bg-opacity-75 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4 flex flex-col lg:flex-row">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Payment</h1>

          <button
            onClick={handleGoBack}
            className="absolute top-4 right-4 font-bold bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition duration-300"
          >
            Back
          </button>

          <h2 className="text-xl text-black font-bold mb-4">Selected Items</h2>
          {cartItems.length > 0 ? (
            <ul className="space-y-2 font-bold text-black">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>₱ {item.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600">No items in the cart.</p>
          )}

          <div className="mt-4 text-lg font-semibold text-black">Total Amount: ₱ {totalAmount}</div>

          <form className="mt-4" onSubmit={handleSubmit}>
            <label className="text-black font-bold block mb-2">
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a method</option>
                <option value="Cod">Cash on Delivery</option>
                <option value="Gcash">GCash</option>
              </select>
            </label>

            <label className="text-black font-bold block mb-2">
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </label>

            <label className="text-black font-bold block mb-2">
              Contact Number:
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </label>

            <label className="text-black font-bold block mb-2">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </label>

            {paymentMethod === 'Gcash' && (
              <label className="font-bold text-black block mb-2">
                Proof of Payment:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofOfPayment(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </label>
            )}

            <button
              type="submit"
              className="w-full font-bold bg-yellow-600 text-white py-2 rounded mt-4 hover:bg-yellow-700 transition duration-300"
            >
              Submit Payment
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </div>

        {paymentMethod === 'Gcash' && (
          <div className="w-full lg:w-1/2 p-8 flex flex-col items-center justify-center">
            <label className="block font-bold mb-2 text-black">QR Code:</label>
            <div className="border-2 border-gray-300 rounded p-4 flex items-center justify-center h-80 w-full relative">
              <Image src="/images/GCASH.jpg" alt="QR Code" layout="fill" objectFit="contain" />
            </div>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4 text-center">
            <h2 className="text-xl font-bold text-black mb-4">Confirm Payment</h2>
            <p className="text-black mb-6">Are you sure you want to proceed with the payment?</p>
            <button
              onClick={handleConfirmPayment}
              className="font-bold bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition duration-300"
            >
              Yes, Confirm Payment
            </button>

            <button
              onClick={handleCancelPayment}
              className="font-bold bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 transition duration-300"
            >
              No, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
