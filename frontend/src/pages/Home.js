import React, { useEffect , useState} from "react";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/cartContext";
const Home = () => {
    const [products, setProducts] = React.useState([]);
    const {cart} = React.useContext(CartContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            
            try {
                const response = await api.get('/products');
                  setProducts(response.data);
                 if(response.data.length > 0){
                     setLoading(false);
                 }
                  
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                 setLoading(false);
            } 
        };

        fetchProducts();

    }, [cart,loading]);
  

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="flex flex-wrap items-center justify-center">
              
               <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">PRODUCTOS</h1>
               <p className="w-full text-2xl font-bold text-center p-8 dark:text-white">
             { loading ? "Cargando productos..." : `Total productos: ${products.filter (product => product.stock > 0).length}`}
                </p>
                
                
                {products.map((product) => ( 
                    <ProductCard key={product._id} product={product} className="shadow-md rounded-md" />
                ))}
            </div>
        </section>
    )
    


};
// {products.filter(product => product.stock > 0).map((product)

export default Home;

