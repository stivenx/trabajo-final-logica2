import React from "react";
import { Link } from "react-router-dom";


const ProductCard = ({ product }) => {
    return (
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4">
        <Link to={`/product/${product._id}`}>
        <img className="p-8 rounded-t-lg object-cover object-center mx-auto  w-64 h-64  "  src={product.image} alt={product.name} />
        </Link>
        <div className="px-5 pb-5">
        <Link to={`/products/${product._id}`}>
            <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
            <span className="text-sm font-bold text-black  dark:text-white">{product.category.name}</span>
        </Link>
        <div className="flex items-center mt-2.5 mb-5">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((star, index) => (
                    <svg key={index} className="w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                ))}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{product.rating} </span>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white"> ${product.price} col</span>
            <Link to={`/products/${product._id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</Link>
            <Link to={`/product/${product._id}`} className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1.5 text-center">
                            Ver producto
                        </Link>
        </div>
    </div>
 </div>


 
    );

};

export default ProductCard