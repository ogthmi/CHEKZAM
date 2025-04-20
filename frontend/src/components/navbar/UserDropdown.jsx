import {Dropdown} from "react-bootstrap";
import {Cookies} from "../../constants/data/Cookies";
import {signout} from "../../services/RequestService"

export function UserDropdown() {
    const handleSignout = async () => {
        await signout(Cookies.getCookie(Cookies.accessToken));
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="dropdown-custom-components"/>
            <Dropdown.Menu>
                <Dropdown.Item href="#personal-info">Thông tin cá nhân</Dropdown.Item>
                <Dropdown.Item href="#personal-info">Góp ý</Dropdown.Item>
                <hr/>
                <Dropdown.Item onClick={handleSignout}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}