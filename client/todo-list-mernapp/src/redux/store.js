import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import taskReducer from "./taskSlice";


export default configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        tasks: taskReducer,
    },
});