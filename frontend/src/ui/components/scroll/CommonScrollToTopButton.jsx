import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

export const CommonScrollToTopButton = () => {
    const topRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false); // Trạng thái hiển thị nút

    const scrollToTop = () => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const checkScrollPosition = () => {
        // Kiểm tra xem trang đã cuộn về đầu chưa
        if (window.scrollY > 100) { // Nếu cuộn xuống quá 100px thì hiển thị nút
            setIsVisible(true);
        } else {
            setIsVisible(false); // Nếu ở đầu trang thì ẩn nút
        }
    };

    useEffect(() => {
        // Lắng nghe sự kiện cuộn
        window.addEventListener('scroll', checkScrollPosition);

        // Dọn dẹp khi component bị hủy
        return () => {
            window.removeEventListener('scroll', checkScrollPosition);
        };
    }, []);

    return (
        <div>
            {/* Phần tử đầu trang mà bạn muốn cuộn tới */}
            <div ref={topRef} />

            {/* Nút cuộn lên đầu trang */}
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '35px', // Kích thước nút
                        height: '35px', // Đảm bảo chiều rộng và chiều cao bằng nhau
                        backgroundColor: 'var(--blue-100)',
                        color: 'var(--blue-900)',
                        borderRadius: '50%',
                        border: 'var(--blue-900) 1px solid',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px', // Điều chỉnh kích thước của icon
                        textAlign: 'center',
                    }}
                >
                    <h6 className={"p-0 pb-1 m-0"}>
                        <i className="fa fa-chevron-up"></i>
                    </h6>
                </Button>
            )}
        </div>
    );
};
