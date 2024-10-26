import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { Link } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('auth');

    useEffect(() => {
        if (isLoggedIn) {
            // Redirect to another page (e.g., home page)
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setcPassword] = useState("");
    const [opt, setOpt] = useState("");
    //Handling  form

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/register", {
                name,
                email,
                phone,
                password,
                cpassword,

            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong !! ");
        }
    };

    return (
        <Layout title={"Sign-up"}>
            <section className="signup">
                <div className="container">
                    <div className="signup-content d-flex">
                        <div className="signup-form">
                            <h2 className="form-title">Create Your Account</h2>
                            <form onSubmit={handleSubmit} className="register-form" id="register-form">
                                <div className="form-group">

                                    <input
                                        type="text"
                                        value={name}
                                        placeholder="Your Name"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
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
                                        type="number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Your Phone"
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
                                <div className="form-group">
                                    <input
                                        type="password"
                                        value={cpassword}
                                        onChange={(e) => setcPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                    />
                                </div>

                                <div className="form-group form-button">
                                    <button
                                        type="submit"
                                        id="signup"
                                        className="mt-4 form-submit border-0"
                                    >
                                        SIGN-UP
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="signup-image">
                            <figure>
                                <img src="images/signup.jpg" alt="sing up image" />
                            </figure>
                            <Link to="/login" className="signup-image-link">
                                I am already member ? Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Register;
