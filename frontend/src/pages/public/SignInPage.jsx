import React from 'react';
import { SignInForm } from "../../components/form/SignInForm"
import { AllPagesLayout } from '../../components/layout/AllPagesLayout';

export function SignInPage() {
    return (
        <AllPagesLayout>
            <SignInForm />
        </AllPagesLayout>
    );
}
