import "./App.css";
import Header from "./Components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./Components/ProductList";
import ProductDetails from "./Components/ProductDetails";
import CartPage from "./Components/Cart";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./Redux/store";
import { getCartItemsAsync } from "./Redux/Slices/cartSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const generateSessionId = (): string => {
    return 'sess_' + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('session_id', sessionId);
    } else {
      dispatch(getCartItemsAsync());
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
