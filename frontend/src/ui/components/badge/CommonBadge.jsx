import React from "react";

export const CommonBadge = ({label, variant = "primary"}) => {
    return (
        <div className = {`badge-outline ${variant}`}>
            {label}
        </div>
    );
}