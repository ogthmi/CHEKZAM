import {Dropdown} from "react-bootstrap";
import {FaCog} from "react-icons/fa";
import {Cookies} from "../../../constants/data/Cookies";
import {signout} from "../../../services/RequestService";
import "../../../css/Dropdown.css"
export function UserDropdown() {
    const handleSignout = async () => {
        await signout(Cookies.getCookie(Cookies.accessToken));
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                variant="link"
                id="dropdown-custom-toggle"
                className="no-caret-toggle text-primary"
            >
                <FaCog size={18}/>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href={"/user/my-profile"}>Thông tin cá nhân</Dropdown.Item>
                <Dropdown.Item href="/feedback">Góp ý </Dropdown.Item>
                <hr/>
                <Dropdown.Item onClick={handleSignout}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
