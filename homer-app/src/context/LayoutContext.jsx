import React, { createContext, useState, useContext } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <LayoutContext.Provider value={{ isFullscreen, setIsFullscreen }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);
