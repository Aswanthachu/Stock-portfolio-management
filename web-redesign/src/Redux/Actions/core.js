import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, getConfig } from "../Api";
import axios from "axios";
import socket from "../Api/socket";
import { setApiLimitError, setError } from "../Features/core";

export const sendEmailOtp = createAsyncThunk(
  "core/sendEmailOtp",
  async ({ email, navigate }, { dispatch }) => {
    try {
      await axios.post(`${baseUrl}/user/send-email-otp`, {
        email,
      });
      navigate("/verify-otp");
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else {
        dispatch(setError(error.response.data));
      }
    }
  }
);

export const signUp = createAsyncThunk(
  "core/signUp",
  async ({ userData, navigate,showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user/signup`,
        { userData },
        config
      );
      localStorage.removeItem("authData");
      localStorage.removeItem("type");
      localStorage.setItem("token", JSON.stringify(data.token));
      const expirationTimeInDays = 6;
      const expirationDate = new Date().getTime() + expirationTimeInDays * 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationDate);
      localStorage.setItem("user", JSON.stringify(data.userData));
      // socket.io.opts.auth.token = JSON.stringify(data.token);
      // socket.disconnect();
      // socket.connect();
      navigate("/dashboard");
      return data;
    } catch (error) {
      console.log(error);
      showToast(error?.response?.data?.message,'error')
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else if (error.response.status === 400)
        dispatch(setError(error.response.data));
    }
  }
);

export const logIn = createAsyncThunk(
  "core/logIn",
  async ({ userData, navigate }, { dispatch }) => {
    try {
      const { data } = await axios.post(`${baseUrl}/user/login`, { userData });
      localStorage.removeItem("type");
      localStorage.setItem("user", JSON.stringify(data.existingUser));
      const { existingUser, token, planStatus } = data;
      localStorage.setItem("token", JSON.stringify(token));
      const expirationTimeInDays = 6;
      const expirationDate = new Date().getTime() + expirationTimeInDays * 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationDate);
      // socket.io.opts.auth.token = token;
      // socket.disconnect();
      // socket.connect();
      if (existingUser.role === 0) {
        localStorage.setItem("status", JSON.stringify({ status: planStatus }));
        navigate("/dashboard");
      } else if (existingUser.role === 1) {
        navigate("/admin/dashboard");
      } else if (existingUser.role === 2 || existingUser.role === 3) {
        navigate("/sub-admin/tickets");
      } else if (existingUser.role === 4) {
        navigate("/sub-admin/users");
      }
      return data;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("authloading");
      localStorage.removeItem("type");
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else if (error.response.status === 400) {
        dispatch(setError(error.response.data));
      }
    }
  }
);

export const sendResetPasswordEmail = createAsyncThunk(
  "core/sendPasswordResetEmail",
  async ({ email, navigate,showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user/send-reset-password-mail`,
        { email },
        config
      );
      if (data) {
        showToast(
          "Password reset link has been send to your registered email address",
          "success"
        );
        navigate("/reset-mail-send-success", { state: email });
        return data;
      }
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response?.status === 400) {
        showToast("Email Not Registered.", "error");
      } else if (response?.status === 429) {
        dispatch(setApiLimitError(true));
      } else {
        showToast("Something went wrong", "error");
      }
      return response;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "core/resetPassword",
  async ({ password, token, navigate ,showToast}, { dispatch }) => {
    try {
      const config = getConfig();
      const { status, data } = await axios.post(
        `${baseUrl}/user/update-password/${token}`,
        { password },
        config
      );
      if (status === 200) {
        showToast(data.message, "success");

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (error) {
      const { message } = error.response.data;
      if (response?.status === 429) {
        dispatch(setApiLimitError(true));
      } else {
        showToast("Something went wrong", "error");
      }

      console.log(error);
    }
  }
);
