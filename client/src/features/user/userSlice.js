import { createSlice } from "@reduxjs/toolkit";
import { signUpUser } from "./userAction";

const initialState = {
    isLoggedIn: false,
    loading: true,
    userInfo:{},
    userToken: null,
    error: null,
    isAdmin: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state,action)=>{
            state.error = action.payload;
        },
        setUserInfo:(state,action)=>{
            state.userInfo = action.payload;
        },
        setUserToken:(state,action)=>{
            state.userToken = action.payload;
        },
        setLoggedIn:(state,action)=>{
            state.isLoggedIn = action.payload;
        },
        setIsAdmin:(state,action)=>{
            state.isAdmin = action.payload;
        }
    },
    extraReducers: {
        // SIGN UP
        [signUpUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [signUpUser.fulfilled]: (state, {payload}) => {
            state.loading = false;
        },
        [signUpUser.rejected]: (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        },
    },
});

export const { setError,setLoading,setUserInfo,setUserToken,setLoggedIn,setIsAdmin } = userSlice.actions;

export default userSlice.reducer;