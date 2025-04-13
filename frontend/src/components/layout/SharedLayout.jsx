import React from "react";
import { CustomNavbar } from "../common/CustomNavbar";

export const SharedLayout = ({ children }) => {
    return (
        <>
            <CustomNavbar/>
            <main>{children}</main>
        </>
    );
}