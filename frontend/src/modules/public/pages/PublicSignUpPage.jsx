import React from 'react';
import { SignUpForm } from "../components/SignUpForm"
import { CommonAppLayout } from '../../../ui/components/layout/CommonAppLayout';

export function PublicSignUpPage() {
    return (
        <CommonAppLayout>
            <SignUpForm />
        </CommonAppLayout>
    );
}