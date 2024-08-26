import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './Slices/productsSlice';
import cartReducer from './Slices/cartSlice';
import categoryReducer from './Slices/categorySlice'

const reducer = combineReducers({
  productsReducer,
  cartReducer,
  categoryReducer
})

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
