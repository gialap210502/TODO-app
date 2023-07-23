import axios from "axios";
import {
    loginStart, loginFailed, loginSuccess,
    registerStart, registerSuccess, registerFailed,
} from "./authSlice";
import {
    getUserStart, getUserFailed, getUserSuccess,
    deleteUserStart, deleteUserFailed, deleteUserSuccess
} from "./userSlice";
import {
    getTaskStart, getTaskFailed, getTaskSuccess,
    deleteTaskStart, deleteTaskFailed, deleteTaskSuccess,
    addTaskStart, addTaskFailed, addTaskSuccess
} from "./taskSlice";

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
                token: `Bearer ${accessToken}`
            }
        });
        dispatch(getUserSuccess(res.data));
    } catch (error) {
        dispatch(getUserFailed());
    }
}
export const deleteUser = async (accessToken, dispatch, id) => {
    dispatch(deleteUserStart());
    try {
        const res = await axios.delete('http://localhost:5500/api/users/' + id, {
            headers: {
                token: `Bearer  + ${accessToken}`
            }
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (error) {
        dispatch(deleteUserFailed(error.response.data));
    }
}
export const getAllListById = async (accessToken, dispatch, id) => {
    dispatch(getTaskStart());
    try {
        const res = await axios.get(`http://localhost:5500/api/users/${id}/items`, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        dispatch(getTaskSuccess(res.data));
    } catch (error) {
        dispatch(getTaskFailed());
    }
}

export const addTaskById = async (task, accessToken, dispatch, id) => {
    dispatch(addTaskStart());
    try {
        const res = await axios.post(`http://localhost:5500/api/users/${id}/items`, {
            task,
            headers: {
                token: `Bearer ${accessToken}`
            }

        });
        dispatch(addTaskSuccess(res.data));
    } catch (error) {
        dispatch(addTaskFailed());
    }
}
export const deleteAllItemsWithStatusTrue = async (accessToken, dispatch, id) => {
    dispatch(deleteTaskStart());
    try {
        const res = await axios.delete(`http://localhost:5500/api/users/${id}/items`, {
            headers: {
                token: `Bearer ${accessToken}`
            },
            params: {
                itemStatus: true
            }
        });
        dispatch(deleteTaskSuccess(res.data));
    } catch (error) {
        dispatch(deleteTaskFailed());
    }
}