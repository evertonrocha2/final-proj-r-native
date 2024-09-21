import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Network from 'expo-network';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  const checkNetworkStatus = async () => {
    const { isConnected } = await Network.getNetworkStateAsync();
    setIsConnected(isConnected);
  };

  useEffect(() => {
    const intervalId = setInterval(checkNetworkStatus, 5000);

    checkNetworkStatus(); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  return useContext(NetworkContext);
};
