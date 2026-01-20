import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "./index.css";
import './App.css';
import  { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/AuthContext";
import CartModal from './context/cartModal';
import {TitlesProvider} from './context/titlesContext'
import {LogoutProvider} from './context/logoutContext'


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
import Prueba from './pages/rpueba';
import Create2 from './pages/create2';
import ProductList from './pages/mostrarPruebas';
import Productid from './pages/pruebaid';
import  ProductoUpdateForm from './pages/editprueba';
import DocumentsCreate from './pages/documentsCreate';
import DocumentsList from './pages/documents';
import DocumentDetail from './pages/documentDetail';
import LogoutModal from './context/logoutModal';

//Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggleBubble from './components/ThemeToggleBubble';

function App() {
  return (
    <AuthProvider>
    <CartProvider>
    
    <Router>
      <LogoutProvider>
      <TitlesProvider>
      <Navbar />
      <CartModal />
      <LogoutModal />
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
        <Route path="/prueba" element={<Prueba />} />
        <Route path="/create2" element={<Create2 />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/prueba/:id" element={<Productid />} />
        <Route path="/edit/:id" element={<ProductoUpdateForm />} />
        <Route path="/documents/create" element={<DocumentsCreate />} />
        <Route path="/documents" element={<DocumentsList />} />
        <Route path="/documents/:id" element={<DocumentDetail />} />



        
      
        </Routes>
      <Footer />
      <ThemeToggleBubble />
      </TitlesProvider>
      </LogoutProvider>
    </Router>
    
    </CartProvider>
    </AuthProvider>
    
  );
}

export default App;