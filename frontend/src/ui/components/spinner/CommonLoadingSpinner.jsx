import { Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";

export function CommonLoadingSpinner({ message = "Đang tải...", isVisible, onFadeOutComplete }) {
    const [show, setShow] = useState(isVisible);
    const [localVisible, setLocalVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            setTimeout(() => {
                setLocalVisible(true);
            }, 10);
        } else {
            setLocalVisible(false);
            const timer = setTimeout(() => {
                setShow(false);
                if (onFadeOutComplete) onFadeOutComplete();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onFadeOutComplete]);

    return (
        show && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                opacity: localVisible ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>
                <div className="text-center text-white">
                    <Spinner
                        animation="border"
                        role="status"
                        style={{ width: '5rem', height: '5rem', borderWidth: '0.5rem' }}
                    >
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                    <p className="mt-5 fs-4">{message}</p>
                </div>
            </div>
        )
    );
}
