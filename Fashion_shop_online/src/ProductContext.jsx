import React, {createContext, useState, useContext, useEffect} from "react";
import axios from 'axios';

const ProductContext = createContext();

export const ProductProvider = ({children}) => 
{
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        //const response = await fetch("https://fakestoreapi.com/products");
        //const data = await response.json();
        //setProducts(data);
        try {
            const response = await axios.get('http://localhost:3001/products');
            if (response.data.status === 'success') {
                setProducts(response.data.products);
            } else {
                console.error('Failed to fetch products:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <ProductContext.Provider value={{products, setProducts, fetchProducts}}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    return useContext(ProductContext);
}