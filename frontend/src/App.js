import {ToastContainer} from 'react-toastify';
import {BrowserRouter as Router} from 'react-router-dom';
import {AppRoutes} from "./router/AppRoutes";

function App() {
    return (
        <Router>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={2500}/>
        </Router>
    );
}

export default App;
