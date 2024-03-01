import { createSlice } from "@reduxjs/toolkit";
import { logIn, sendEmailOtp, signUp} from "../Actions/core";

const initialState = {
  loading: false,
  manualLoading: false,
  userData: null,
  error: "",
  rejected: false,
  apiLimitError:false
};

const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers: {
    resetState: (state) => {
      localStorage.clear();
      return initialState;
    },
    setUser: (state) => {
      const user = JSON.parse(localStorage.getItem("user"));
      state.userData = user;
    },
    setError: (state, action) => {
      state.error = action.payload.message;
    },
    setApiLimitError:((state,action)=>{
      state.apiLimitError=action.payload;
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmailOtp.pending,(state,action)=>{
        state.loading=true;
      })
      .addCase(sendEmailOtp.fulfilled,(state,action)=>{
        state.loading=false;
      })
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.rejected = true;
      })
      .addCase(logIn.pending, (state, action) => {
        state.loading = true;
        state.manualLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        if (action?.payload?.existingUser)
          state.userData = action.payload.existingUser;
        state.loading = false;

      })
      .addCase(logIn.rejected, (state, action) => {
        state.rejected = true;

      })

  },
});

export default coreSlice.reducer;
export const { setUser, resetState, setError,setApiLimitError } = coreSlice.actions;
