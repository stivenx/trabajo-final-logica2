import React, { useEffect , useState} from "react";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/cartContext";
const Home = () => {
    const [products, setProducts] = React.useState([]);
    const {cart} = React.useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage, setProductsPerPage] = useState(5)

    const lastProductIndex = currentPage * productsPerPage;
    const firsproductIndex = lastProductIndex - productsPerPage;
    const  currentProducts = products.slice(firsproductIndex,lastProductIndex)
    const totalPages = Math.ceil(products.length / productsPerPage);

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
   const TotalProducts = currentProducts.filter (product => product.stock > 0).length

   const renderPages = () => {
        const visiblePages = [];
        const visibleButtons = 3;
        const ellipsis = "...";

        // Caso 1: pocas páginas → mostrar todas
        if (totalPages <= visibleButtons + 2) {
            for (let i = 1; i <= totalPages; i++) {
            visiblePages.push(i);
            }
        } 
        // Caso 2: estamos al inicio
        else if (currentPage <= visibleButtons) {
            for (let i = 1; i <= visibleButtons + 1; i++) {
            visiblePages.push(i);
            }
            visiblePages.push(ellipsis, totalPages);
        } 
        // Caso 3: estamos al final
        else if (currentPage >= totalPages - visibleButtons) {
            visiblePages.push(1, ellipsis);
            for (let i = totalPages - visibleButtons; i <= totalPages; i++) {
            visiblePages.push(i);
            }
        } 
        // Caso 4: estamos en el medio
        else {
            visiblePages.push(1, ellipsis);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            visiblePages.push(i);
            }
            visiblePages.push(ellipsis, totalPages);
        }

        // Renderizado de los botones
        return visiblePages.map((page, index) =>
            page === ellipsis ? (
            <span key={`ellipsis-${index}`} className="text-gray-500 dark:text-gray-300 px-2">
                {page}
            </span>
            ) : (
            <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md transition-colors 
                ${currentPage === page 
                    ? "bg-blue-600 text-white font-semibold" 
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-500 hover:text-white"
                }`}
            >
                {page}
            </button>
            )
        );
    };
  
    const nexPage =()=>{
        setCurrentPage((prev)=> Math.min(prev + 1, totalPages));
    }

    const prevPage =()=>{
        setCurrentPage((prev)=> Math.max(prev - 1, 1));
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4">
            
            {/* Título */}
            <h1 className="w-full text-5xl font-bold text-center mb-6 dark:text-white">
                PRODUCTOS
            </h1>

            {/* Total productos */}
            <p
                key={TotalProducts}
                className="w-full text-2xl font-semibold text-center mb-10 dark:text-white"
            >
                {loading ? "Cargando productos..." : `Total productos: ${TotalProducts}`}
            </p>

            {/* Selector de página */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <label className="text-gray-700 dark:text-gray-200 font-medium">
                Ir a página:
                </label>
                <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                    Página {index + 1}
                    </option>
                ))}
                </select>
            </div>

            {/* Productos */}
            <div className="flex flex-wrap justify-center gap-6 w-full mb-12">
                {currentProducts.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    className="shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-transform hover:scale-105"
                />
                ))}
            </div>

            {/* Botones de paginación */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
               <div className="flex items-center justify-center gap-3 flex-wrap mt-6">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:text-white font-medium transition 
                ${
                    currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
                Anterior
            </button>

            {renderPages()}

            <button
                onClick={nexPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:text-white font-medium transition 
                ${
                    currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
                Siguiente
            </button>
            </div>

               
            </div>
            </div>
        </section>
        );

    


};
// {products.filter(product => product.stock > 0).map((product)

export default Home;

