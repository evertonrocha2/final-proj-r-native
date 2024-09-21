// FraldasContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const FraldasContext = createContext();

export const useFraldas = () => {
    return useContext(FraldasContext);
};



export const FraldasProvider = ({ children }) => {
    
    const [quantidadeFraldas, setQuantidadeFraldas] = useState(0);

    return (
        <FraldasContext.Provider value={{ quantidadeFraldas, setQuantidadeFraldas }}>
            {children}
        </FraldasContext.Provider>
    );
};
