import { LinkButton } from "../button/LinkButton";
import { SUB_ENDPOINTS } from '../../constants/endPoints';

export function SignButtons() {
    return (
        <div>
            <LinkButton
                href={SUB_ENDPOINTS.auth.signin}
                variant="light"
                className="me-2 text-center"
                content="Đăng nhập"
            />
            <LinkButton
                href={SUB_ENDPOINTS.auth.signup}
                content="Đăng ký"
            />
        </div>
    );
}
