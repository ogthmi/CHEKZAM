import {ToastContainer} from 'react-toastify';
import {BrowserRouter as Router} from 'react-router-dom';
import {AppRoutes} from "./router/AppRoutes";
import {ModalProvider} from "./ui/components/modal/CommonModalContext";
import {CommonScrollToTopButton} from "./ui/components/scroll/CommonScrollToTopButton";
import React from "react";

function App() {
    return (
        <ModalProvider>
            <CommonScrollToTopButton/>
            <Router>
                <AppRoutes/>
                <ToastContainer position="top-right" autoClose={2500}/>
            </Router>
        </ModalProvider>
    );
}

export default App;
