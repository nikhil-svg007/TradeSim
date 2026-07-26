import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // Connect to the backend
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Listen for price updates
    newSocket.on('price-update', (newPrices) => {
      setPrices(newPrices);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, prices }}>
      {children}
    </SocketContext.Provider>
  );
};
