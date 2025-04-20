import React from 'react';
import { SignUpForm } from "../../components/form/SignUpForm"
import { AllPagesLayout } from '../../components/layout/AllPagesLayout';

export function SignUpPage() {
    return (
        <AllPagesLayout>
            <SignUpForm />
        </AllPagesLayout>
    );
}