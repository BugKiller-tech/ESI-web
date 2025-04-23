'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

import {
    HorseInfo,
    Product,
} from 'types';
import {
    useCart
} from '@/context/CartContext';
import {
    ShoppingBasketIcon,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';


interface AddCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (product: Product) => void;

    horse: HorseInfo | null;
}

export const AddCartModal: React.FC<AddCartModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    horse,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const {
        products,
        addToCart,
    } = useCart();

    // Get unique categories
    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category)));
    }, [products]);

    // Filter products based on selected category
    const productsForCategory = useMemo(() => {
        return products.filter(p => p.category === selectedCategory);
    }, [products, selectedCategory]);

    const readyToAddCart = useMemo(() => {
        if (selectedProduct && quantity > 0) {
            return true;
        }
        return false;
    }, [selectedProduct, quantity])

    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories]);

    // Initial mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sync category and product when modal opens or products update
    useEffect(() => {
        if (categories.length === 0) return;

        const initialCategory = selectedCategory || categories[0];
        setSelectedCategory(initialCategory);

        const initialProduct = products.find(p => p.category === initialCategory);
        setSelectedProduct(initialProduct || null);
    }, [categories, selectedCategory, products]);

    // Update selected product when category changes
    useEffect(() => {
        if (productsForCategory.length > 0) {
            setSelectedProduct(productsForCategory[0]);
        } else {
            setSelectedProduct(null);
        }
    }, [productsForCategory]);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
        }
    }, [isOpen]);

    const updateQuantity = (e: any) => {
        try {
            let newVal = parseInt(e.target.value || 1);
            if (newVal > 0) {
                setQuantity(newVal);
            }

        } catch (error) {
            console.log(error);
        }
    }


    const processForSelectProdcut = (productId: string) => {
        const prod = products.find(p => p._id === productId)
        if (prod) {
            setSelectedProduct(prod);
        }
    }

    const addToCartWithSelectedProduct = () => {
        // onConfirm(selectedProduct);
        addToCart({
            horse: horse,
            product: selectedProduct,
            quantity: quantity,
        })
        onClose();
    }

    return (
        <Modal
            title='Add image to Cart'
            description='Please select the product you want to purchase for the selected image'
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-full w-[600px]'
        >
            <div className='flex flex-col md:flex-row gap-2'>
                <div>
                    {horse && <img src={horse.thumbnailS3Link} width='200px' />}
                </div>
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex flex-wrap gap-2'>
                        {
                            categories.map((c) => (
                                <div key={c}
                                    className={'border border-gray-500 rounded-md px-5 py-2 cursor-pointer ' + (selectedCategory == c ? 'bg-main-color text-white' : '')}
                                    onClick={() => {
                                        setSelectedCategory(c);
                                    }}>{c}</div>
                            ))
                        }
                    </div>
                    <Select
                        onValueChange={(value) => { processForSelectProdcut(value) }}
                        defaultValue={selectedProduct?._id || ''}
                        value={selectedProduct?._id}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select product' />
                        </SelectTrigger>
                        <SelectContent>
                            {productsForCategory.map((p) => (
                                <SelectItem value={`${p._id}`} key={p._id}>
                                    <span>{p.name}</span> - <span>${p.price}</span>
                                </SelectItem>
                            ))
                            }
                        </SelectContent>
                    </Select>
                    <Input type="number" value={quantity} onChange={(e) => updateQuantity(e)} />

                    <div className='flex w-full items-center justify-end space-x-2 pt-6'>
                        <Button disabled={!readyToAddCart} variant='destructive' onClick={addToCartWithSelectedProduct}
                            className='flex gap-2 bg-main-color'>
                            <ShoppingBasketIcon />
                            Add to cart
                        </Button>
                        <Button disabled={loading} variant='outline' onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
