import '../../css/LoadingOverLay.css';

export function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
    );
}
