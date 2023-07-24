import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./NavBar.css";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/apiRequest";
import { createAxios } from '../../creatInstance';
import { logOutSuccess } from '../../redux/authSlice';
const NavBar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = user?.accessToken;
    const id = user?._id;
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const handleLogout = () => {
        try {
            logOut(dispatch, id, navigate, accessToken, axiosJWT);
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