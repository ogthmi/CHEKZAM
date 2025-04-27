import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

export const LinkButton = ({ variant = "primary", size = null, content, className = "", href, reload = false }) => {
    const handleClick = (e) => {
        if (reload) {
            e.preventDefault();
            window.location.href = href;
        }
    };

    return (
        <Link to={href} className={className} onClick={handleClick}>
            <Button variant={variant} size={size} className={className}>
                {content}
            </Button>
        </Link>
    );
};


