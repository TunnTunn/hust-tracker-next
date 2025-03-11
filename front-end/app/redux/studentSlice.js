import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    student: null,
};

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setStudent: (state, action) => {
            state.student = action.payload;
        },
        clearStudent: (state) => {
            state.student = null;
        },
    },
});

// Export actions
export const { setStudent, clearStudent } = studentSlice.actions;

// Export the reducer
export default studentSlice.reducer;
