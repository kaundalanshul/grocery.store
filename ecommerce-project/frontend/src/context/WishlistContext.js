import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

export const WishlistContext = createContext();

const normalizeWishlist = (items = []) => items
  .map((item) => (typeof item === 'string' ? item : item?._id || item?.id || item))
  .filter(Boolean);

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchWishlist = React.useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/users/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const syncWishlist = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        fetchWishlist();
      } else {
        setWishlist([]);
      }
    };

    syncWishlist();
    window.addEventListener('auth-change', syncWishlist);
    window.addEventListener('storage', syncWishlist);

    return () => {
      window.removeEventListener('auth-change', syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to add to wishlist');
      return;
    }

    const targetId = typeof productId === 'object' ? productId?._id || productId?.id : productId;

    try {
      const isFavourited = wishlist.some(item => 
        (typeof item === 'string' ? item : item._id || item.id) === targetId
      );
      
      let newWishlist;
      if (isFavourited) {
        newWishlist = wishlist.filter(item => (typeof item === 'string' ? item : item._id || item.id) !== targetId);
      } else {
        newWishlist = [...wishlist, productId];
      }
      setWishlist(newWishlist);

      const response = await axios.post(
        '/api/users/wishlist/toggle',
        { productId: targetId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setWishlist(response.data.wishlist || newWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    const targetId = typeof productId === 'object' ? productId?._id || productId?.id : productId;
    return wishlist.some(item => (typeof item === 'string' ? item : item?._id || item?.id) === targetId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
