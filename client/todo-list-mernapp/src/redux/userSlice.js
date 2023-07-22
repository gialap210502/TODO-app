import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: {
            allUsers: null,
            isfetching: false,
            error: false
        }
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
        }
    }
});
export const {
    getUserStart,
    getUserFailed,
    getUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;