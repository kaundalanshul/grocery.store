import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const normalizeCartItem = (item) => ({
  ...item,
  _id: item?._id || item?.id || item?.product?._id || item?.product || item?.sku,
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i._id === action.payload._id);
      const quantityToAdd = Math.max(1, Number(action.payload.quantity || 1));
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, quantity: i.quantity + quantityToAdd } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: quantityToAdd }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter(i => i._id !== id) };
      }
      return {
        ...state,
        items: state.items.map(i => (i._id === id ? { ...i, quantity } : i)),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: (action.payload || []).map(normalizeCartItem).filter(item => item._id) };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      }
    } catch (_) {}
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartContext;
