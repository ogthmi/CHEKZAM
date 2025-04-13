import React from 'react';
import { SharedLayout } from '../../components/layout/SharedLayout.jsx';
import { Header } from '../../components/landing/Header.jsx';
import { Footer } from '../../components/landing/Footer.jsx';
import { Feartures } from '../../components/landing/Features.jsx';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/shared-style.css';

function Landing() {
    return (
        <SharedLayout>
            <Header />
            <Feartures />
            <Footer />
        </SharedLayout>
    );
}
export default Landing;



