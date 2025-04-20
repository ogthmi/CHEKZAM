import React from "react";
import { CustomNavbar } from "../common/CustomNavbar";

export const AllPagesLayout = ({ children }) => {
    return (
        <>
            <CustomNavbar/>
            <main>{children}</main>
        </>
    );
}