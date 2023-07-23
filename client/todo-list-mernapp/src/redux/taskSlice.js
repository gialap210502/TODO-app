import { createSlice } from "@reduxjs/toolkit";

const TaskSlice = createSlice({
    name: 'task',
    initialState: {
        tasks: {
            allTasks: null,
            isfetching: false,
            error: false
        },
        msg: ""
    },
    reducers: {
        getTaskStart: (state) => {
            state.tasks.isfetching = true;
        },
        getTaskSuccess: (state, action) => {
            state.tasks.isfetching = false;
            state.tasks.allTasks = action.payload;
        },
        getTaskFailed: (state) => {
            state.tasks.isfetching = false;
            state.tasks.error = true;
        },
        deleteTaskStart: (state) => {
            state.tasks.isfetching = true;
        },
        deleteTaskSuccess: (state, action) => {
            state.tasks.isfetching = false;
            state.msp = action.payload;
        },
        deleteTaskFailed: (state, action) => {
            state.tasks.isfetching = false;
            state.tasks.error = true;
            state.msp = action.payload;
        },
        addTaskStart: (state) => {
            state.tasks.isfetching = true;
        },
        addTaskSuccess: (state, action) => {
            state.tasks.isfetching = false;
            state.msp = action.payload;
        },
        addTaskFailed: (state, action) => {
            state.tasks.isfetching = false;
            state.tasks.error = true;
            state.msp = action.payload;
        },
        updateTaskStart: (state) => {
            state.tasks.isfetching = true;
        },
        updateTaskSuccess: (state, action) => {
            state.tasks.isfetching = false;
            state.msp = action.payload;
        },
        updateTaskFailed: (state, action) => {
            state.tasks.isfetching = false;
            state.tasks.error = true;
            state.msp = action.payload;
        }

    }
});
export const {
    getTaskStart,
    getTaskFailed,
    getTaskSuccess,
    deleteTaskStart,
    deleteTaskFailed,
    deleteTaskSuccess,
    addTaskStart,
    addTaskFailed,
    addTaskSuccess,
    updateTaskStart,
    updateTaskFailed,
    updateTaskSuccess
} = TaskSlice.actions;

export default TaskSlice.reducer;