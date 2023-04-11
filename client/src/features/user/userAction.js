import { createAsyncThunk } from "@reduxjs/toolkit";

export const signUpUser = createAsyncThunk(
  "user/signUp",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      // SEND REQUEST TO BACKEND
    } catch (err) {
      if (err.response && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
