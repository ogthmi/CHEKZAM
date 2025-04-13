import { COOKIES } from "../../constants/data";
import { ROLES } from "../../constants/roles";
import { getCookie } from "../../utils/cookiesUtil";
import { UserDropdown } from "./UserDropdown";

function toRolePlaceholder(inputRole) {
    for (const role of Object.values(ROLES)) {
        if (role.name === inputRole) {
            return role.placeHolder;
        }
    }
    return "Chức vụ chính";
}

export function FullNamePlaceholder() {
    const userResponse = getCookie(COOKIES.compactUserInfo);
    const fullName = userResponse?.fullName || "Tên người dùng";
    const mainRole = toRolePlaceholder(getCookie(COOKIES.mainRole));

    return (
        <div className='d-flex'>
            <div className="text-end text-primary me-1">
                <h6 className="m-0 fw-bold">{fullName}</h6>
                <p className="m-0">{mainRole}</p>
            </div>
            <UserDropdown />
        </div>
    );
}
