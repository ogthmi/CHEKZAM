import { Link, useLocation } from "react-router-dom";

export function CommonHorizontalTab({ tabs, basePath }) {
    const location = useLocation();

    return (
        <div className="row nav mt-2 mx-md-0 mx-2 border-bottom">
            <ul className="nav navbar justify-content-center px-md-5 px-2">
                {tabs.map(({ key, label, path }) => {
                    const isActive = location.pathname.startsWith(`${basePath}/${path}`);

                    return (
                        <li className="nav-item" key={key}>
                            <Link 
                                className={`nav-link ${isActive ? "active" : ""}`} 
                                to={`${basePath}/${path}`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
