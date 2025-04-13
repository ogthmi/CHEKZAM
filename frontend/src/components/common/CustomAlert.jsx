import { Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

function CustomAlert({ message, error, timeOut = 5000 }) {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (message) setAlert({ type: 'success', text: message });
        else if (error) setAlert({ type: 'danger', text: error });
        const timer = setTimeout(() => setAlert(null), timeOut);
        return () => clearTimeout(timer);
    }, [message, error]);

    return alert ? <Alert variant={alert.type} className="p-2 text-center">{alert.text}</Alert> : null;
}

export default CustomAlert;
