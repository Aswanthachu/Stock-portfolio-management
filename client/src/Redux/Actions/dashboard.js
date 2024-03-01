import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, getConfig } from "../Api";
import axios from "axios";
import { setApiLimitError } from "../Features/core";

export const getDashboardTable = createAsyncThunk(
    "dashboard/getDashboardTable",
    async (_,{dispatch}) => {
      try {
        const config = getConfig();
        const { data } = await axios.get(
          `${baseUrl}/user-portfolio/get-dashboard`,
          config
        );
        if (data) return data;
      } catch (error) {
        console.log(error);
        if(error.response.status === 429){
          dispatch(setApiLimitError(true));
        }
      }
    }
  );
  
  export const getDashboardGraph = createAsyncThunk(
    "dashboard/getDashboardGraph",
    async (_,{dispatch}) => {
      console.log("hello");
      try {
        const config = getConfig();
        const { data } = await axios.get(
          `${baseUrl}/user-portfolio/get-dashboard-graph-data`,
          config
        );
        if (data) return data;
      } catch (error) {
        console.log(error);
        if(error.response.status === 429){
          dispatch(setApiLimitError(true));
        }
      }
    }
  );