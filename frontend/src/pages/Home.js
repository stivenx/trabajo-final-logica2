import React, { useEffect , useState} from "react";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/cartContext";
const Home = () => {
    const [products, setProducts] = React.useState([]);
    const {cart} = React.useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchProducts();
    }, [cart]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="flex flex-wrap items-center justify-center">
               <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">PRODUCTOS</h1>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} className="shadow-md rounded-md" />
                ))}
            </div>
        </section>
    )
    


};

export default Home;

