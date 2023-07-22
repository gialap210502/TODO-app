import axios from "axios";
import {
    loginStart, loginFailed, loginSuccess,
    registerStart, registerSuccess, registerFailed,
} from "./authSlice";
import { getUserStart, getUserFailed, getUserSuccess } from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:5500/api/users/login', user);
        dispatch(loginSuccess(res.data));
        navigate("/home");
    } catch (error) {
        dispatch(loginFailed());
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('http://localhost:5500/api/users/register', user);
        dispatch(registerSuccess());
        navigate("/");
    } catch (error) {
        dispatch(registerFailed());
    }
}
export const getAllUser = async (accessToken, dispatch) => {
    dispatch(getUserStart());
    try {
        const res = await axios.get('http://localhost:5500/api/users', {
            headers: {
                token: `Bearer  + ${accessToken}`
            }
        });
        dispatch(getUserSuccess(res.data));
    } catch (error) {
        dispatch(getUserFailed());
    }
}
// export const getAllListById = async (accessToken, dispatch) => {
//     dispatch(getUserStart());
//     try {
//         const res = await axios.get('http://localhost:5500/api/users/:userId/items', {
//             headers: {
//                 token: `Bearer  + ${accessToken}`
//             }
//         });
//         dispatch(getUserSuccess(res.data));
//     } catch (error) {
//         dispatch(getUserFailed());
//     }
// }