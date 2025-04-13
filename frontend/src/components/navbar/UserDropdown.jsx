import { Dropdown } from "react-bootstrap";
import { getCookie, removeCookie } from "../../utils/cookiesUtil";
import { COOKIES } from "../../constants/data";
import { SUB_ENDPOINTS } from "../../constants/endPoints";
import { signout } from "../../services/authService";

export function UserDropdown() {
    const handleSignOut = async () => {
        try {
            const response = await signout(getCookie(COOKIES.token));
            if (response) {
                removeCookie(COOKIES.compactUserInfo);
                removeCookie(COOKIES.mainRole);
                removeCookie(COOKIES.token)
                window.location.href = SUB_ENDPOINTS.home.landing;
            }
            console.log(response);
            
        }
        catch (error){
            throw new Error(error.message)
        }
        
        
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="dropdown-custom-components" />
            <Dropdown.Menu>
                <Dropdown.Item href="#personal-info">Thông tin cá nhân</Dropdown.Item>
                <Dropdown.Item href="#personal-info">Góp ý</Dropdown.Item>
                <hr />
                <Dropdown.Item onClick={handleSignOut}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}