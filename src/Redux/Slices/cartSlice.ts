import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import client from '../../apolloClient';
import { gql } from '@apollo/client';
import { Product } from './productsSlice';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  loading: false,
  error: null,
};

const GET_CART = gql`
  query GetCart($session_id: String!) {
    getCart(session_id: $session_id) {
      id
      product {
        id
        name
        price
        image
        quantity
      }
      quantity
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($product_id: Int!, $quantity: Int!, $session_id: String!) {
    addToCart(product_id: $product_id, quantity: $quantity, session_id: $session_id) {
      id
      product {
        id
        name
        price
        image
        quantity
      }
      quantity
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const CLEAR_CART = gql`
mutation ClearCart($sessionId: String!) {
  clearCart(sessionId: $sessionId)
}
`;

// Thunks
export const getCartItemsAsync = createAsyncThunk(
  'cart/getCart',
  async () => {
    const { data } = await client.query({
      query: GET_CART,
      variables: { session_id: localStorage['session_id'] },
    });
    return data.getCart;
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const { data } = await client.mutate({
      mutation: ADD_TO_CART,
      variables: { product_id: +productId, quantity, session_id: localStorage['session_id'] },
    });
    return data.addToCart;
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }: { id: number; quantity: number }) => {
    const { data } = await client.mutate({
      mutation: UPDATE_CART_ITEM,
      variables: { id: +id, quantity },
    });
    return data.updateCartItem;
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number) => {
    const { data } = await client.mutate({
      mutation: REMOVE_FROM_CART,
      variables: { id },
    });
    return data.removeFromCart;
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async () => {
    const { data } = await client.mutate({
      mutation: CLEAR_CART,
      variables: { sessionId: localStorage['session_id'] },
    });

    if (data.clearCart) {
      return true;
    } else {
      throw new Error('Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItemsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartItemsAsync.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.itemCount = action.payload.length;
      })
      .addCase(getCartItemsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      })
      .addCase(addToCartAsync.fulfilled, (state, action: PayloadAction<CartItem>) => {
        const existingItemIndex = state.items.findIndex(item => item.product.id === action.payload.product.id);
        if (existingItemIndex > -1) {
          state.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.itemCount += action.payload.quantity;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action: PayloadAction<CartItem>) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (itemIndex > -1) {
          state.items[itemIndex].quantity = action.payload.quantity;
        }
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
        const itemIndex = state.items.findIndex(item => item.id == action.payload.id);
        if (itemIndex !== -1) {
          state.items.splice(itemIndex, 1);
          state.itemCount -= 1;
        }
      })
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.itemCount = 0;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cartReducer.items;
export const selectCartItemCount = (state: RootState) => state.cartReducer.itemCount;
