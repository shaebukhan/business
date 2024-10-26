import React from 'react';
import { NavLink } from 'react-router-dom';
const AdminMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <NavLink to="/dashboard/admin" className="text-dark border-bottom-0" style={{ textDecoration: " None" }}>
                        <h4>Admin Dashboard</h4>
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action" aria-current="true">
                        Create-Category
                    </NavLink>
                    {/* <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">Create New Product</NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">All-Products</NavLink>
                    <NavLink to="/dashboard/admin/inqueries" className="list-group-item list-group-item-action">Inqueries</NavLink>
                    <NavLink to="/dashboard/admin/sipoc" className="list-group-item list-group-item-action">SIPOC</NavLink> */}

                </div>
            </div>
        </>
    );
};

export default AdminMenu;