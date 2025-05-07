import { CommonLinkButton } from "../CommonLinkButton"
import { Endpoints } from '../../../constants/links/Endpoints';

export function SignButtons() {
    return (
        <div>
            <CommonLinkButton
                href={Endpoints.auth.signin}
                variant="light"
                className="me-2 text-center"
                content="Đăng nhập"
            />
            <CommonLinkButton
                href={Endpoints.auth.signup}
                content="Đăng ký"
            />
        </div>
    );
}
