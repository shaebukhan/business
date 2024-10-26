import React from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/Auth';
import UserMenu from '../../components/Layout/UserMenu';
const Dashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - EODB "}>
            <div className="container-fluid  p-5">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card w-75 p-3">
                            <h3>Name : {auth?.user?.name}</h3>
                            <h3>Email : {auth?.user?.email}</h3>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Dashboard;