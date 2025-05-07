import { createContext, useCallback, useState, useMemo } from "react";

export const CommonModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        currentModal: null,
        modalProps: {},
    });

    const showModal = useCallback((modalType, props = {}) => {
        setModalState({ currentModal: modalType, modalProps: props });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ currentModal: null, modalProps: {} });
    }, []);

    const contextValue = useMemo(() => ({
        modalState,
        showModal,
        closeModal
    }), [modalState, showModal, closeModal]);

    return (
        <CommonModalContext.Provider value={contextValue}>
            {children}
        </CommonModalContext.Provider>
    );
};
