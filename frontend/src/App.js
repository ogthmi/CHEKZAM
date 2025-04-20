import { ToastContainer } from 'react-toastify';

import { BrowserRouter as Router, Routes} from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes'

function App() {
    return (
        <Router>
            <Routes>
                {AppRoutes}
            </Routes>
            <ToastContainer position="top-right" autoClose={2500} />
        </Router>
    );
}

export default App;
