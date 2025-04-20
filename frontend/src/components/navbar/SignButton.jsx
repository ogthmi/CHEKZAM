import { LinkButton } from "../button/LinkButton"
import { Endpoints } from '../../constants/links/Endpoints';

export function SignButtons() {
    return (
        <div>
            <LinkButton
                href={Endpoints.auth.signin}
                variant="light"
                className="me-2 text-center"
                content="Đăng nhập"
            />
            <LinkButton
                href={Endpoints.auth.signup}
                content="Đăng ký"
            />
        </div>
    );
}
