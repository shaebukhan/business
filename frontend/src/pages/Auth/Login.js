import React, { useState, useEffect } from "react";
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./auth.css";
import { useAuth } from "../../context/Auth";


const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('auth');

    useEffect(() => {
        if (isLoggedIn) {
            // Redirect to another page (e.g., home page)
            navigate('/');
        }
    }, [isLoggedIn, navigate]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/login", {
                email, password
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Something Went Wrong !! ");
        }
    };

    return (
        <Layout title="Login">
            <section className="signup">
                <div className="container">
                    <div className="signin-content d-flex">
                        <div className="signin-image">
                            <figure><img src="images/signin.jpg" alt="sing up image" /></figure>
                        </div>
                        <div className="signin-form">
                            <h2 className="form-title">Login</h2>
                            <form onSubmit={handleSubmit} className="register-form" id="login-form">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your Email"
                                    />
                                </div>
                                <div className="form-group">

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </div>
                                <Link to="/forgot-password" className="signup-image-link">Forgot Password ?</Link>

                                <div className="form-group form-button">
                                    <button
                                        type="submit"
                                        className="form-submit border-0"
                                    >
                                        Login
                                    </button>
                                </div>
                                <Link to="/register" className="signup-image-link">Don't have an Account ? Register</Link>

                            </form>

                        </div>
                    </div>
                </div>
            </section>


        </Layout>
    );
};

export default Login;