import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./NavBar.css";
import { useSelector } from "react-redux";
const NavBar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const handleLogout = async () => {
        try {
            await axios.post(`http://localhost:5500/api/users/logout`)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <nav className="navbar-container">
            <Link to="/Home" className="navbar-home"> Home </Link>
            {user ? (
                <>
                    <p className="navbar-user">Hi, <span> {user.username}  </span> </p>
                    <button onClick={handleLogout} className="navbar-logout"> Log out</button>
                </>
            ) : (
                <>
                    <Link to="/" className="navbar-login"> Login </Link>
                    <Link to="/register" className="navbar-register"> Register</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;