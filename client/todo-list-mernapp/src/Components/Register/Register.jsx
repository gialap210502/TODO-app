import '../../App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { registerUser } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [uname, setUname] = useState('');
    const [pass, setPass] = useState('');
    const [repass, setRepass] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //register user to database
    const addUser = async (e) => {
        e.preventDefault();

        try {
            const user = {
                username: uname,
                password: pass
            }
            if (pass == repass) {
                registerUser(user, dispatch, navigate);
            } else {
                console.log("password not match")
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
            <h1>Register</h1>
            <hr />
            <form onSubmit={e => addUser(e)}>
                <label id="lb"><b>Username</b></label><br />
                <input type="text" placeholder="Enter Email" name="email" id="email" required onChange={e => { setUname(e.target.value) }} value={uname}></input>
                <label id="lb"><b>Password</b></label><br />
                <input type="password" placeholder="Enter Password" name="psw" id="psw" required onChange={e => { setPass(e.target.value) }} value={pass}></input>
                <label id="lb"><b>Confirm Password</b></label><br />
                <input type="password" placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required onChange={e => { setRepass(e.target.value) }} value={repass}></input>
                <button type="submit" className="registerbtn">Register</button>
            </form>
            <div >
                <p>Already have an account? <Link to="/" >Sign in</Link>.</p>
            </div>
        </div>
    );
}

export default Register;