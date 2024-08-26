import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import client from '../../apolloClient';
import { gql } from '@apollo/client';
import { Category } from './categorySlice';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category?: Category;
  image: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  rating?: number;
  reviews?: number;
}

interface IProduct {
  totalItems: number;
  products: Product[]
}

interface ProductsState {
  total: number;
  items: Product[];
  loading: boolean;
  error: string | null;
  productDetails: Product | null
}

const initialState: ProductsState = {
  total: 0,
  items: [],
  loading: false,
  error: null,
  productDetails: null
};

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const GET_PRODUCT_BY_ID = gql`
        query GetProductById($id: ID!) {
          getProductById(id: $id) {
            id
            name
            description
            price
            quantity
            category {
              name
            }
            brand
            weight
            dimensions
            material
            rating
            reviews
            image
          }
        }
      `;
      const { data } = await client.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
      });
      return data.getProductById;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { search = '', page = 1, pageSize = 100, categoryId }: { search?: string; page?: number; pageSize?: number; categoryId?: number },
    { rejectWithValue }
  ) => {
    try {
      const GET_PRODUCTS = gql`
        query GetProducts($search: String, $page: Int, $pageSize: Int, $categoryId: Int) {
          getProducts(search: $search, page: $page, pageSize: $pageSize, categoryId: $categoryId) {
            products {
              id
              name
              price
              image
              quantity
            }
            totalItems
            totalPages
            currentPage
          }
        }
      `;

      const { data } = await client.query({
        query: GET_PRODUCTS,
        variables: { search, page, pageSize, categoryId },
      });

      return data.getProducts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.totalItems;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';;
      });
  },
});

export default productsSlice.reducer;

export const selectProducts = (state: RootState) => state.productsReducer.items;
export const selectProductById = (state: RootState, productId: number) =>
  state.productsReducer.items.find((product) => product.id === productId);