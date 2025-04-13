import React from "react";
import {SharedLayout} from "../../components/layout/SharedLayout"
import { ForgotPassWordForm } from "../../components/form/ForgotPasswordForm";

function ForgotPassword() {
    return (
        <SharedLayout>
            <ForgotPassWordForm/>
        </SharedLayout>

    );
};

export default ForgotPassword;
