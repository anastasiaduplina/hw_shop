import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { products } from '../data/products';

export const CartContext = createContext();

function withImages(list) {
  return list
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return { ...product, qty: item.qty };
    })
    .filter(Boolean);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('cart').then((saved) => {
      if (saved) {
        setItems(withImages(JSON.parse(saved)));
      }
    });
  }, []);

  const saveCart = async (newItems) => {
    setItems(newItems);
    const toSave = newItems.map((i) => ({ id: i.id, qty: i.qty }));
    await AsyncStorage.setItem('cart', JSON.stringify(toSave));
  };

  const addToCart = async (product) => {
    const existing = items.find((i) => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      newItems = [...items, { ...product, qty: 1 }];
    }
    await saveCart(newItems);
  };

  const decreaseQty = async (productId) => {
    const existing = items.find((i) => i.id === productId);
    if (!existing) return;

    if (existing.qty <= 1) {
      await saveCart(items.filter((i) => i.id !== productId));
    } else {
      await saveCart(
        items.map((i) =>
          i.id === productId ? { ...i, qty: i.qty - 1 } : i
        )
      );
    }
  };

  const getQty = (productId) => {
    const found = items.find((i) => i.id === productId);
    return found ? found.qty : 0;
  };

  const removeFromCart = async (productId) => {
    const newItems = items.filter((i) => i.id !== productId);
    await saveCart(newItems);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        decreaseQty,
        getQty,
        removeFromCart,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
