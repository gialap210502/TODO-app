import axios from "axios";
import {
    loginStart, loginFailed, loginSuccess,
    registerStart, registerSuccess, registerFailed,
    logOutStart, logOutSuccess, logOutFailed
} from "./authSlice";
import {
    getUserStart, getUserFailed, getUserSuccess,
    deleteUserStart, deleteUserFailed, deleteUserSuccess
} from "./userSlice";
import {
    getTaskStart, getTaskFailed, getTaskSuccess,
    deleteTaskStart, deleteTaskFailed, deleteTaskSuccess,
    addTaskStart, addTaskFailed, addTaskSuccess,
    updateTaskStart, updateTaskFailed, updateTaskSuccess
} from "./taskSlice";
axios.defaults.baseURL = 'http://15.235.202.44:5500/';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://15.235.202.44:5500/api/users/login', user, { withCredentials: true });
        dispatch(loginSuccess(res.data));
        navigate("/home");
    } catch (error) {
        dispatch(loginFailed());
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('http://15.235.202.44:5500/api/users/register', user);
        dispatch(registerSuccess());
        navigate("/");
    } catch (error) {
        dispatch(registerFailed());
    }
}
export const getAllUser = async (accessToken, dispatch) => {
    dispatch(getUserStart());
    try {
        const res = await axios.get('http://15.235.202.44:5500/api/users', {
            headers: {
                token: `Bearer ${accessToken}`
            }

        }, { withCredentials: true });
        dispatch(getUserSuccess(res.data));
    } catch (error) {
        dispatch(getUserFailed());
    }
}
export const deleteUser = async (accessToken, dispatch, id) => {
    dispatch(deleteUserStart());
    try {
        const res = await axios.delete('http://15.235.202.44:5500/api/users/' + id, {
            headers: {
                token: `Bearer  + ${accessToken}`
            }
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (error) {
        dispatch(deleteUserFailed(error.response.data));
    }
}
export const getAllListById = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(getTaskStart());
    try {
        const res = await axiosJWT.get(`http://15.235.202.44:5500/api/users/${id}/items`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getTaskSuccess(res.data));

    } catch (error) {
        dispatch(getTaskFailed());
    }
}

export const addTaskById = async (task, accessToken, dispatch, id, axiosJWT) => {
    dispatch(addTaskStart());
    try {
        const res = await axiosJWT.post(`http://15.235.202.44:5500/api/users/${id}/items`, {
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
export const deleteItem = async (accessToken, dispatch, id, userId, axiosJWT) => {
    dispatch(deleteTaskStart());
    try {
        const res = await axiosJWT.delete(`http://15.235.202.44:5500/api/users/${userId}/items/${id}`, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        dispatch(deleteTaskSuccess(res.data));
    } catch (error) {
        dispatch(deleteTaskFailed());
    }
}
export const deleteAllItemsWithStatusTrue = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteTaskStart());
    try {
        const res = await axiosJWT.delete(`http://15.235.202.44:5500/api/users/${id}/items`, {
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

export const updateItem = async (accessToken, dispatch, id, userId, updateItemText) => {
    dispatch(updateTaskStart());
    try {
        const res = await axios.put(`http://15.235.202.44:5500/api/users/${userId}/items/${id}`, {
            headers: {
                token: `Bearer ${accessToken}`
            },
            item: updateItemText
        });
        dispatch(updateTaskSuccess(res.data));
    } catch (error) {
        dispatch(updateTaskFailed());
    }
}

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post(`http://15.235.202.44:5500/api/users/logout`, id, {
            headers: {
                token: `Bearer ${accessToken}`
            },
        });
        dispatch(logOutSuccess());
        navigate("/")
    } catch (err) {
        dispatch(logOutFailed());
    }
}
