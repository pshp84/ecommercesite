import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { clearCartAsync, getCartItemsAsync, removeFromCartAsync } from '../Redux/Slices/cartSlice';
import AddToCartButton from './AddToCartButton';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cartReducer.items);
  const loading = useSelector((state: RootState) => state.cartReducer.loading);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (loading) {
    return <Loader />;
  }

  const handleRemove = (id: number) => {
    dispatch(removeFromCartAsync(id));
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      navigate('/');
      dispatch(clearCartAsync());
    }, 2000);
  };

  const getSubtotal = (quantity: number, price: number) => (quantity * price).toFixed(2);
  const getTotal = () => cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2);


  return (
    <div className="max-w-3xl mx-auto p-6">
      {cartItems.length === 0 ? (
        <EmptyState message="Your cart is empty. Add some items to your cart to see them here." />
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-gray-600">${item.product.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AddToCartButton product={item.product} showRemoveButton={false} />
                  <span className="ml-4 min-w-24">${getSubtotal(item.quantity, item.product.price)}</span>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <h2 className="text-xl font-semibold">Total: ${getTotal()}</h2>
            <button
              className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
              onClick={handlePlaceOrder}
              disabled={orderPlaced}
            >
              {orderPlaced ? 'Order Placed!' : 'Place Order'}
            </button>
          </div>
          {orderPlaced && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Order Placed!</h2>
                <p>Your order has been successfully placed. Redirecting to the homepage...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
