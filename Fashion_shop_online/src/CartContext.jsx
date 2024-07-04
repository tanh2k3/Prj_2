import React, { createContext, useState, useContext, useEffect} from "react";

const CartContext = createContext();

export const CartProvider = ({children}) => 
{
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage if available
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(
                (item) =>
                    item._id === product._id &&
                    item.selectedColor === product.selectedColor &&
                    item.selectedSize === product.selectedSize 
            );

            if (existingProductIndex >= 0) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                const newCart = [...prevCart];
                newCart[existingProductIndex].quantity += product.quantity;
                return newCart;
            } else {
                return [...prevCart, product];
            }
        });
    };

    const removeFromCart = (product) => {
        setCart(cart.filter((item) => item._id !== product._id || 
        item.selectedColor !== product.selectedColor || 
        item.selectedSize !== product.selectedSize));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
}