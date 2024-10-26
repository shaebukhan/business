import React from 'react';
import { NavLink } from 'react-router-dom';
const UserMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <NavLink to="/dashboard/user" className="text-dark border-bottom-0" style={{ textDecoration: " None" }}>
                        <h4>Dashboard</h4>
                    </NavLink>
                    <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action" aria-current="true">
                        Profile
                    </NavLink>

                </div>
            </div>
        </>
    );
};

export default UserMenu;