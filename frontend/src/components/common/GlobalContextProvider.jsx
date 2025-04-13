import { createContext, useContext, useState } from "react";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
    const [dataStore, setDataStore] = useState({
        selectedRowData: null,
    });

    const setData = (key, data) => {
        setDataStore(prev => ({ ...prev, [key]: data }));
    };

    return (
        <GlobalContext.Provider value={{ dataStore, setData }}>
            {children}
        </GlobalContext.Provider>
    );
}

// Custom hook để sử dụng dễ dàng
export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
}
