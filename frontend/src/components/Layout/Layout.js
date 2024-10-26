import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";

const Layout = ({ children, title, description, keywods, author }) => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywods} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
};

Layout.defaultProps = {
    title: "MYGL",
    description: "js",
    keywods: "mern,react,node,mongodb",
    author: "Shaebu"
};



export default Layout;