import moment from "moment";

export const formatEmptyValue = (value, fallback = '—') => {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    return value;
};

export const formatAssignmentType = (type) => {
    switch (type) {
        case 'SINGLE_CHOICE':
            return 'Trắc nghiệm một đáp án';
        case 'MULTIPLE_CHOICE':
            return 'Trắc nghiệm nhiều đáp án';
        default:
            return 'Không xác định';
    }
};

export const formatDuration = (minutes) => {
    return minutes > 0 ? `${minutes} phút` : 'Không giới hạn';
};

export const formatMaxAttempts = (maxAttempts) => {
    return maxAttempts > 0 ? `${maxAttempts} lượt` : 'Không giới hạn';
}

export const formatShuffleEnabled = (shuffleEnabled) => {
    return shuffleEnabled ? "Có" : "Không";
}


export const formatDateTimeToDisplay = (dateStr) => {
    if (!dateStr) return 'Không thiết lập';

    return dateStr
};

export const formatDateTimeToProcess = (dateStr) => {
    if (!dateStr) return null;

    // Nếu dateStr là định dạng dd-MM-yyyy HH:mm
    const date = moment(dateStr, 'DD-MM-YYYY HH:mm');

    // Trả về định dạng yyyy-MM-ddTHH:mm cho input type="datetime-local"
    return date.format('YYYY-MM-DDTHH:mm');
};

export const formatDateTimeToRequest = (dateStr) => {
    if (!dateStr) return null;

    const date = moment(dateStr);
    return date.format('DD-MM-YYYY HH:mm');
};


