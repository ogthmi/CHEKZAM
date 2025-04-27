import React from "react";
import { CustomNavbar } from "../common/CustomNavbar";
import {Outlet} from "react-router-dom";

export const AllPagesLayout = ({ children }) => {
    return (
        <>
            <CustomNavbar/>
            <main>
                {children || <Outlet/>}
            </main>

        </>
    );
}