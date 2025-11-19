'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useCurrency } from './CurrencyContext';

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  // Product details (assuming they are returned with cart items)
  id: number;
  title: string;
  price: number;
  images: string[];
  condition: 'new' | 'used';
  stock: number;
}

interface OfflineCartAction {
  type: 'add' | 'remove' | 'update';
  productId?: number;
  cartItemId?: number;
  quantity?: number;
  timestamp: number; // To help with ordering
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartSubtotal: number;
  cartGST: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GST_RATE = 0.10; // 10% GST in Australia
const OFFLINE_CART_ACTIONS_KEY = 'offline_cart_actions';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id as string, 10) : null;
  const { currency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState({ AUD: 1, USD: 0.67, EUR: 0.61 });

  const calculateTotals = useCallback(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const convertedSubtotal = subtotal * exchangeRates[currency];
    const gst = convertedSubtotal * GST_RATE;
    const total = convertedSubtotal + gst;
    return { subtotal: convertedSubtotal, gst, total };
  }, [cartItems, currency, exchangeRates]);

  const { subtotal: cartSubtotal, gst: cartGST, total: cartTotal } = calculateTotals();

  // Helper to get offline actions
  const getOfflineActions = (): OfflineCartAction[] => {
    if (typeof window === 'undefined') return [];
    const actions = localStorage.getItem(OFFLINE_CART_ACTIONS_KEY);
    return actions ? JSON.parse(actions) : [];
  };

  // Helper to save offline actions
  const saveOfflineAction = (action: OfflineCartAction) => {
    if (typeof window === 'undefined') return;
    const actions = getOfflineActions();
    actions.push(action);
    localStorage.setItem(OFFLINE_CART_ACTIONS_KEY, JSON.stringify(actions));
  };

  // Helper to clear offline actions
  const clearOfflineActions = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(OFFLINE_CART_ACTIONS_KEY);
  };

  // Sync offline cart actions with the server
  const syncOfflineCart = useCallback(async () => {
    if (!userId || !navigator.onLine) return;

    const actions = getOfflineActions();
    if (actions.length === 0) return;

    console.log('Attempting to sync offline cart actions:', actions);

    for (const action of actions) {
      try {
        let res;
        if (action.type === 'add' && action.productId && action.quantity) {
          res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: action.productId, quantity: action.quantity }),
          });
        } else if (action.type === 'update' && action.cartItemId && action.quantity) {
          res = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId: action.cartItemId, quantity: action.quantity }),
          });
        } else if (action.type === 'remove' && action.cartItemId) {
          res = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId: action.cartItemId }),
          });
        }

        if (res && res.ok) {
          console.log(`Successfully synced action: ${action.type}`);
        } else {
          console.error(`Failed to sync action ${action.type}:`, res?.statusText);
          // If an action fails, stop syncing and keep remaining actions for next attempt
          return;
        }
      } catch (error) {
        console.error(`Error syncing action ${action.type}:`, error);
        // If an action fails, stop syncing and keep remaining actions for next attempt
        return;
      }
    }

    clearOfflineActions();
    // After syncing, re-fetch the entire cart from the server to ensure consistency
    await loadCartFromServer();
  }, [userId]);

  const loadCartFromServer = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart from API');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart from API:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load cart from local storage or API on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (userId) {
        await loadCartFromServer();
        await syncOfflineCart(); // Attempt to sync any pending actions after loading server cart
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
      setLoading(false);
    };
    loadCart();
  }, [userId, loadCartFromServer, syncOfflineCart]);

  // Persist cart to local storage if not logged in
  useEffect(() => {
    if (!userId && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  // Listen for online/offline events to trigger sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('App is online, attempting to sync cart...');
      syncOfflineCart();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncOfflineCart]);

  const addItem = async (productId: number, quantity: number) => {
    if (!userId || !navigator.onLine) {
      // Store action offline
      saveOfflineAction({ type: 'add', productId, quantity, timestamp: Date.now() });
      // Optimistically update guest cart
      const existingItem = cartItems.find(item => item.product_id === productId);
      if (existingItem) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.product_id === productId ? { ...item, quantity: item.quantity + quantity } : item
          )
        );
      } else {
        // Fetch product details for guest cart (if possible, or use placeholder)
        try {
          const res = await fetch(`/api/products/${productId}`);
          if (res.ok) {
            const product = await res.json();
            setCartItems(prevItems => [
              ...prevItems,
              {
                cart_item_id: Date.now() + Math.random(), // Unique ID for guest cart item
                product_id: productId,
                quantity,
                id: product.id,
                title: product.title,
                price: product.price,
                images: product.images,
                condition: product.condition,
                stock: product.stock,
              },
            ]);
          } else {
            console.error('Failed to fetch product details for guest cart, adding with minimal info');
            setCartItems(prevItems => [
              ...prevItems,
              {
                cart_item_id: Date.now() + Math.random(),
                product_id: productId,
                quantity,
                id: productId, // Use productId as id for now
                title: `Product ${productId}`, // Placeholder
                price: 0, // Placeholder
                images: [],
                condition: 'new',
                stock: 0,
              },
            ]);
          }
        } catch (error) {
          console.error('Error fetching product details for guest cart, adding with minimal info:', error);
          setCartItems(prevItems => [
            ...prevItems,
            {
              cart_item_id: Date.now() + Math.random(),
              product_id: productId,
              quantity,
              id: productId,
              title: `Product ${productId}`,
              price: 0,
              images: [],
              condition: 'new',
              stock: 0,
            },
          ]);
        }
      }
      return;
    }

    // Online and logged in: proceed with API call
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.product_id === updatedItem.product_id);
          if (existingItemIndex > -1) {
            return prevItems.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: updatedItem.quantity } : item
            );
          }
          return [...prevItems, updatedItem];
        });
      } else {
        console.error('Failed to add item to cart via API');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateItem = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    if (!userId || !navigator.onLine) {
      saveOfflineAction({ type: 'update', cartItemId, quantity, timestamp: Date.now() });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cart_item_id === cartItemId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.cart_item_id === updatedItem.cart_item_id ? updatedItem : item
          )
        );
      } else {
        console.error('Failed to update cart item via API');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!userId || !navigator.onLine) {
      saveOfflineAction({ type: 'remove', cartItemId, timestamp: Date.now() });
      setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
      return;
    }

    try {
      const res = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId }),
      });
      if (res.ok) {
        setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
      } else {
        console.error('Failed to remove cart item via API');
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const clearCart = async () => {
    if (!userId || !navigator.onLine) {
      clearOfflineActions();
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch('/api/cart/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setCartItems([]);
      } else {
        console.error('Failed to clear cart via API');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        cartTotal,
        cartSubtotal,
        cartGST,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}