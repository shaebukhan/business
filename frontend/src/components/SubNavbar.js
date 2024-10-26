import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubNavbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        // Check if the current path matches the provided path
        return location.pathname === path;
    };
    return (
        <div>
            <div className="container-fluid">
                <div className="sub-nav-main">
                    <Link to="/" className={`sub-nav-item ${isActive('/') && 'sub-nav-item-active'}`}>App Name</Link>
                    <Link to="/accounts" className={`sub-nav-item ${isActive('/accounts') && 'sub-nav-item-active'}`}>Accounts</Link>
                    <Link to="/categories" className={`sub-nav-item ${isActive('/categories') && 'sub-nav-item-active'}`}>Categories</Link>
                    <Link to="/transactions" className={`sub-nav-item ${isActive('/transactions') && 'sub-nav-item-active'}`}>Transactions</Link>
                    <Link to="/entries" className={`sub-nav-item ${isActive('/entries') && 'sub-nav-item-active'}`}>Entries</Link>
                    <Link to="/reconcile" className={`sub-nav-item ${isActive('/reconcile') && 'sub-nav-item-active'}`}>Reconcile</Link>
                </div>
            </div>
        </div>
    );
};

export default SubNavbar;
