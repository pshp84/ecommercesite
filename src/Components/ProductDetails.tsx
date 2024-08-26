import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { fetchProductById } from '../Redux/Slices/productsSlice';
import AddToCartButton from './AddToCartButton';
import Loader from './Loader';
import NotFound from './NotFound';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = +(id ?? 0);
  const dispatch = useDispatch<AppDispatch>();

  const productDetails = useSelector((state: RootState) => state.productsReducer.productDetails);

  const loading = useSelector((state: RootState) => state.productsReducer.loading);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  if (loading) {
    return <Loader />;
  }

  if (!productDetails) {
    return <NotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0">
          <h1 className="text-4xl font-bold mb-4">{productDetails.name}</h1>
          <p className="text-gray-500 mb-2">Category: <span className="font-semibold">{productDetails.category?.name}</span></p>
          <p className="text-gray-600 mb-4">{productDetails.description}</p>
          <p className="text-2xl font-semibold mb-4">${productDetails.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-2">Available Quantity: {productDetails.quantity}</p>
          <p className="text-sm text-gray-500 mb-2">Brand: {productDetails.brand || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-2">Weight: {productDetails.weight || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-2">Dimensions: {productDetails.dimensions || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-2">Material: {productDetails.material || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-2">Rating: {productDetails.rating ? productDetails.rating.toFixed(1) : 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-4">Reviews: {productDetails.reviews || 'N/A'}</p>
          <AddToCartButton product={productDetails} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
