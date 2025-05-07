import {Cookies} from "../../../constants/data/Cookies";
import {UserRoles} from "../../../constants/data/UserRoles";
import {UserDropdown} from "./UserDropdown";

export function FullNamePlaceholder() {
    const userInfo = Cookies.getCookie(Cookies.userInfo);
    const fullName = userInfo.lastName + " " + userInfo.firstName || "Tên người dùng";
    const mainRole = Cookies.getCookie(Cookies.mainRole);
    const roleLabel = UserRoles[mainRole.toLowerCase()].label || "Chức vụ chính";

    return (
        <div className='d-flex'>
            <div className="text-end text-primary me-1">
                <h6 className="m-0 fw-bold">{fullName}</h6>
                <p className="m-0">{roleLabel}</p>
            </div>
            <UserDropdown/>
        </div>
    );
}
