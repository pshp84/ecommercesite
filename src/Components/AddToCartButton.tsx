import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { addToCartAsync, removeFromCartAsync, updateQuantityAsync } from '../Redux/Slices/cartSlice';
import { Product } from '../Redux/Slices/productsSlice';

interface AddToCartButtonProps {
  product: Product;
  showRemoveButton?: boolean
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, showRemoveButton = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItem = useSelector((state: RootState) =>
    state.cartReducer.items.find(item => item.product.id === product.id)
  );

  const handleAddToCart = () => {
    if (cartItem) {
      if (cartItem.quantity < product.quantity) {
        dispatch(updateQuantityAsync({ id: cartItem.id, quantity: cartItem.quantity + 1 }));
      }
    } else {
      dispatch(addToCartAsync({ productId: product.id, quantity: 1 }));
    }
  };

  const handleRemoveFromCart = () => {
    if (cartItem) {
      dispatch(removeFromCartAsync(cartItem.id));
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(updateQuantityAsync({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
    }
  };

  return (
    <div className="text-center mt-2 mb-2">
      {cartItem ? (
        <div className="flex items-center justify-center space-x-2">
          {showRemoveButton && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleRemoveFromCart}
            >
              Remove
            </button>
          )}
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={handleDecreaseQuantity}
            disabled={cartItem.quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2">{cartItem.quantity}</span>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddToCart}
            disabled={cartItem.quantity >= product.quantity}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
