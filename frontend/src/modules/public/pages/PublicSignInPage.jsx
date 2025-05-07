import React from 'react';
import { SignInForm } from "../components/SignInForm"
import { CommonAppLayout } from '../../../ui/components/layout/CommonAppLayout';

export function PublicSignInPage() {
    return (
        <CommonAppLayout>
            <SignInForm />
        </CommonAppLayout>
    );
}
