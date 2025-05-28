import moment from "moment";


export function convertDateToInputFormat(dateStr) {
    if (!dateStr) return '';
    return moment(dateStr, ['DD-MM-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD');
}

export function formatGender(gender) {
    if (gender === 'MALE') return 'Nam';
    else if (gender === 'FEMALE') return 'Nữ';
    return "-";
}
