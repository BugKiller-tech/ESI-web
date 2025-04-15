'use client'; // Required for Next.js App Router

import {
    createContext, ReactNode, useContext,
    useEffect, useState
} from 'react';
import { CartItem } from 'types';

const CartContext = createContext({
    addToCart: (_: CartItem) => { },
    reduceOneFromCart: (_: CartItem) => { },
    removeFromCart: (_: CartItem) => { },
    clearCart: () => { },
    cartItems: [],
    totalCount: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);


    // 🔄 Load from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // 💾 Save to localStorage on changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);



    function isSameImageAndProduct(item1: CartItem, item2: CartItem) {
        return item1.horseImageId === item2.horseImageId && item1.productId === item2.horseImageId
    }

    const addToCart = (newCartItem: CartItem) => {
        setCartItems((prev) => {
            const exists = prev.find((item) => {
                return isSameImageAndProduct(item, newCartItem)
            });

            if (exists) {
                return prev.map((item) =>
                    isSameImageAndProduct(item, newCartItem)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...newCartItem, quantity: 1 }];
        });
    };

    const removeFromCart = (cartItemToRemove: CartItem) => {
        setCartItems((prev) => prev.filter((item) => {
            return !isSameImageAndProduct(item, cartItemToRemove);
        }));
    };

    const reduceOneFromCart = (cartItemToRemove: CartItem) => {
        setCartItems((prev) => prev.filter((item) => {
            if (isSameImageAndProduct(item, cartItemToRemove)) {
                if (item.quantity > 1) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }).map(item => {
            if (isSameImageAndProduct(item, cartItemToRemove)) {
                return {
                    ...item,
                    quantity: item.quantity - 1,
                }
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{
            addToCart, reduceOneFromCart, removeFromCart, clearCart,
            cartItems, totalCount,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);