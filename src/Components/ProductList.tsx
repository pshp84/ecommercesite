import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../Redux/Slices/productsSlice';
import { fetchCategories } from '../Redux/Slices/categorySlice';
import { AppDispatch, RootState } from '../Redux/store';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import Loader from './Loader';
import NotFound from './NotFound';
import EmptyState from './EmptyState';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Product state
  const products = useSelector((state: RootState) => state.productsReducer.items);
  const loading = useSelector((state: RootState) => state.productsReducer.loading);
  const error = useSelector((state: RootState) => state.productsReducer.error);

  // Category state
  const categories = useSelector((state: RootState) => state.categoryReducer.categories);
  const categoryLoading = useSelector((state: RootState) => state.categoryReducer.loading);
  const categoryError = useSelector((state: RootState) => state.categoryReducer.error);

  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchTerm, categoryId: selectedCategory }));
  }, [searchTerm, selectedCategory, dispatch]);

  const handleSearch = () => {
    setSearchTerm(search);
  };

  if (loading || categoryLoading) {
    return <Loader />;
  }

  if (error) return <p>Error: {error}</p>;
  if (categoryError) return <p>Error fetching categories: {categoryError}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      <div className="mb-6">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {products.length ?
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              <Link to={`product/${product.id}`}>
                <img src={product.image} alt={product.name} className="h-48 w-full object-cover mb-4 rounded-t-lg" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </Link>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <p className="text-indigo-600 font-bold mt-4">${product.price}</p>
              <AddToCartButton product={product} />
            </div>
          ))}
        </div> :
        <EmptyState message="No products found." />
      }
    </div>
  );
};

export default ProductList;
