import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

export const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
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
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to add to wishlist');
      return;
    }

    try {
      const isFavourited = wishlist.some(item => 
        (typeof item === 'string' ? item : item._id) === productId
      );
      
      let newWishlist;
      if (isFavourited) {
        newWishlist = wishlist.filter(item => 
          (typeof item === 'string' ? item : item._id) !== productId
        );
      } else {
        newWishlist = [...wishlist, productId];
      }
      setWishlist(newWishlist);

      const response = await axios.post(
        '/api/users/wishlist/toggle',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => 
      (typeof item === 'string' ? item : item._id) === productId
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
