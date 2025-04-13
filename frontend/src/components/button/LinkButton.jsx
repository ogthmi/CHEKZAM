import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
export const LinkButton = ({ variant = "primary", size = null, content, className = "", href }) => {
    const handleClick = (e) => {
        e.preventDefault();
        window.location.href = href;
    };
    return (
        <Link to={href} className={className}>
            <Button variant={variant} size={size} onClick={handleClick}>{content}</Button>
        </Link>
    );
};

