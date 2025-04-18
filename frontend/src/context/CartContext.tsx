'use client'; // Required for Next.js App Router

import {
    createContext, ReactNode, useContext,
    useEffect, useState,
} from 'react';
import {
    Product,
    CartItem
} from 'types';
import * as APIs from '@/apis';

const CartContext = createContext({
    addToCart: (_: CartItem) => { },
    reduceOneFromCart: (_: CartItem) => { },
    removeFromCart: (_: CartItem) => { },
    clearCart: () => { },
    products: [] as Product[],
    cartItems: [] as CartItem[],
    subTotal: 0,
    taxTotal: 0,
    flatShippingFee: 0,
    totalToPay: 0,

    totalCount: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [taxAndShippingFee, setTaxAndShippingFee] = useState<{
        tax: number,
        flatShippingFee: number    
    }>({
        tax: 0,
        flatShippingFee: 0,
    });


    // 🔄 Load from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        fetchProducts();
        fetchTaxAndFee();
    }, []);
    const fetchProducts = async () => {
        const response = await APIs.getAllProducts();
        if (response.data) {
            console.log('fetching products inside context', response.data.products);
            setProducts(response.data.products);
        }
    }
    const fetchTaxAndFee = async () => {
        const response = await APIs.getTaxAndShippingFeeSetting();
        if (response.data) {
            console.log('tax and fee fetching is like', response.data);
            setTaxAndShippingFee(response.data);
        }
    }

    // 💾 Save to localStorage on changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);



    function isSameImageAndProduct(item1: CartItem, item2: CartItem) {
        return item1.horse._id === item2.horse._id && item1.product._id === item2.product._id
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
            return [...prev, { ...newCartItem, quantity: newCartItem.quantity || 1 }];
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
    let subTotal = 0;
    let subTotalForPrints = 0;
    cartItems.map(item => {
        subTotal += ( item.quantity * item.product.price );
        if (!item.product.isDigitalProduct) {
            subTotalForPrints += ( item.quantity * item.product.price );
        }
    });

    const taxTotal = subTotalForPrints / 100 * taxAndShippingFee.tax;
    const flatShippingFee = cartItems.filter(item => !item.product.isDigitalProduct).length > 0 ? taxAndShippingFee.flatShippingFee : 0;
    const totalToPay = subTotal + taxTotal + flatShippingFee;

    return (
        <CartContext.Provider value={{
            addToCart, reduceOneFromCart, removeFromCart, clearCart,
            products,
            cartItems,
            subTotal,
            taxTotal,
            flatShippingFee,
            totalToPay,

            totalCount,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);