import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === item.name,
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem,
        );
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
  };

  const removeFromCart = (itemName) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === itemName,
      );
      if (!existingItem) return prevCart;

      if (existingItem.qty === 1) {
        return prevCart.filter((cartItem) => cartItem.name === itemName);
      } else {
        return prevCart.map((cartItem) =>
          cartItem.name === itemName
            ? { ...cartItem, qty: cartItem.qty - 1 }
            : cartItem,
        );
      }
    });
  };

  const getItemQty = (itemName) => {
    const item = cart.find((cartItem) => cartItem.name === itemName);
    return item ? item.qty : 0;
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getItemQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
