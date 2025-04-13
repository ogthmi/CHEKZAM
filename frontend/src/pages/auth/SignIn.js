import React from 'react';
import { SignInForm } from '../../components/form/SignInForm';
import { SharedLayout } from '../../components/layout/SharedLayout';

function SignIn() {
    return (
        <SharedLayout>
            <SignInForm />
        </SharedLayout>
    );
}
export default SignIn;

