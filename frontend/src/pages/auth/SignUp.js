import React from 'react';
import { SignUpForm } from "../../components/form/SignUpForm"
import { SharedLayout } from '../../components/layout/SharedLayout';

function SignUp() {
    return (
        <SharedLayout>
            <SignUpForm />
        </SharedLayout>
    );
}

export default SignUp;