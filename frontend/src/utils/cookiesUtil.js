// Lưu đối tượng hoặc giá trị đơn giản vào cookie
export function setCookie(name, value) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000)); // 1 ngày
    const expiresString = "expires=" + expires.toUTCString();
    
    let valueString;
    if (typeof value === 'object') {
        valueString = JSON.stringify(value);
    } else {
        valueString = value;
    }

    document.cookie = `${name}=${valueString}; ${expiresString}; path=/`;
}
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            const value = c.substring(nameEQ.length, c.length);
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
    }
    
    return null;
}

export const removeCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
