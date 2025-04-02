import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "./index.css";
import './App.css';
import  { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/AuthContext";
import CartModal from './context/cartModal';


//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DetaillProduct from './pages/detaillProduct';
import Categorys from './pages/category';
import CatagoryProduct from './pages/categoryProduct';
import Admin from './pages/Admin';
import AdminCreate from './pages/AdminCreate';
import AdminEdit from './pages/AdminEdit';
import Users from './pages/Users';
import UserEdit from './pages/UsersEdit';
import CategoryList from './pages/CategoryList';
import CategoryCreate from './pages/CategoryCreate';
import CategoryEdit from './pages/CategoryEdit';
import ProductosPorCategoriaYTipo from './pages/productsCategoType';
import ProductSearch from './pages/searchProducts';
import CartPage from './pages/cartPage';


//Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggleBubble from './components/ThemeToggleBubble';

function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      <Navbar />
      <CartModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/product/:id" element={<DetaillProduct />} />
        <Route path="/categoryS" element={<Categorys />} />
        <Route path="/category/:id" element={<CatagoryProduct />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/create" element={<AdminCreate />} />
        <Route path="/admin/edit/:id" element={<AdminEdit />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />
        <Route path="/categoryList" element={<CategoryList />} />
        <Route path="/categoryList/create" element={<CategoryCreate />} />
        <Route path="/categoryList/edit/:id" element={<CategoryEdit />} />
        <Route path="/productsCategoType" element={<ProductosPorCategoriaYTipo />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/cart" element={<CartPage />} />

        

        </Routes>
      <Footer />
      <ThemeToggleBubble />
    </Router>
    </CartProvider>
    </AuthProvider>
    
  );
}

export default App;