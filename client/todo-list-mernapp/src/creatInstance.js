import axios from "axios";
import jwt_decode from "jwt-decode";

const refreshToken = async (token) => {
    try {
        const res = await axios.post("http://localhost:5500/api/users/refresh", {
            token,
        });
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export const createAxios = (user, dispatch, stateSuccess) => {
    console.log(user?.accesstoken + '   Log 1');
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.accesstoken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken(user?.refreshToken);
                const refreshUser = {
                    ...user,
                    accesstoken: data.accesstoken,
                    refreshToken: data.refreshToken
                };
                dispatch(stateSuccess(refreshUser));
                config.headers["token"] = "Bearer " + data.accesstoken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
}