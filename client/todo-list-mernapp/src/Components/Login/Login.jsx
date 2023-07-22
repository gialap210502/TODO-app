import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';

import { useEffect, useState } from 'react';

const Login = () => {
    const [unamel, setUnamel] = useState('');
    const [passl, setPassl] = useState('');
    const [userData, setUserData] = useState([]);
    const [listItems, setListItems] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // login
    const login = async (e) => {
        e.preventDefault();
        try {
            const user = {
                username: unamel,
                password: passl
            }
            loginUser(user, dispatch, navigate);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
            <h1>Login</h1>
            <hr />
            <form onSubmit={e => login(e)}>
                <label id="lb"><b>Username</b></label><br />
                <input type="text" placeholder="Enter Email" name="email" id="email" required onChange={e => { setUnamel(e.target.value) }} value={unamel}></input>
                <label id="lb"><b>Password</b></label><br />
                <input type="password" placeholder="Enter Password" name="psw" id="psw" required onChange={e => { setPassl(e.target.value) }} value={passl}></input>
                <button type="submit" className="registerbtn">Login</button>
            </form>
            <div >
                <p>Don't have an account? <Link to="/Register">Register</Link></p>
            </div>
        </div>
    );
}


export default Login;

