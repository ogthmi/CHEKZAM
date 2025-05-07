import React from "react";
import { CommonNavbar } from "../navbar/CommonNavbar";
import {Outlet} from "react-router-dom";

export const CommonAppLayout = ({ children }) => {
    return (
        <>
            <CommonNavbar/>
            <main>
                {children || <Outlet/>}
            </main>

        </>
    );
}