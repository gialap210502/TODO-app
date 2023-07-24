import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: {
            allUsers: null,
            isfetching: false,
            error: false
        },
        msg: ""
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isfetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isfetching = false;
            state.users.allUsers = action.payload;
        },
        getUserFailed: (state) => {
            state.users.isfetching = false;
            state.users.error = true;
        },
        deleteUserStart: (state) => {
            state.users.isfetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isfetching = false;
            state.msp = action.payload;
        },
        deleteUserFailed: (state, action) => {
            state.users.isfetching = false;
            state.users.error = true;
            state.msp = action.payload;
        }

    }
});
export const {
    getUserStart,
    getUserFailed,
    getUserSuccess,
    deleteUserStart,
    deleteUserFailed,
    deleteUserSuccess
} = userSlice.actions;

export default userSlice.reducer;