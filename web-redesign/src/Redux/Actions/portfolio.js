import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl, getConfig } from "../Api";
import toast from "react-hot-toast";
import { resetState as dashboardReset } from "../Features/dashboard";
import { getDashboardGraph, getDashboardTable } from "./dashboard";
import { setApiLimitError} from "../Features/core";

export const getDashboardPortfolioData = createAsyncThunk(
  "portfolio/getDashboardPortfolioData",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data} = await axios.get(
        `${baseUrl}/user-portfolio/getAllPortfolios-and-first-portfolio-data`,
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

export const getSingleStockDetails = createAsyncThunk(
  "portfolio/getSingleStockDetails",
  async (datas,{dispatch}) => {
    try {
      if (datas.investmentType && datas.portfolioId) {
        const config = getConfig();
        const { data } = await axios.post(
          `${baseUrl}/user-portfolio/get-single-stocktobuy`,
          datas,
          config
        );
        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getSettings = createAsyncThunk(
  "portfolio/getSettings",
  async ({ portfolioId },{dispatch}) => {
    try {
      if (portfolioId) {
        const config = getConfig();
        const { data } = await axios.get(
          `${baseUrl}/user-portfolio/get-single-settings/${portfolioId}`,
          config
        );
        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getSinglePortfolioData = createAsyncThunk(
  "portfolio/getSinglePortfolioData",
  async (datas,{dispatch}) => {
    try {
      if (datas.investmentType && datas.portfolioId) {
        const config = getConfig();
        const { data } = await axios.post(
          `${baseUrl}/user-portfolio/get-single-portfolio`,
          datas,
          config
        );
        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const editPortfolioName = createAsyncThunk(
  "user/editPortfolioName",
  async (datas,{dispatch}) => {
    const { toastId } = datas;
    delete datas.toastId;
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/user-portfolio/edit-portfolio`,
        datas,
        config
      );
      if (data) {
        toast.success("Portfolio Name edited Successfully.", {
          id: toastId,
        });
        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  "portfolio/deletePortfolio",
  async (datas, {dispatch}) => {
    const { toastId } = datas;
    delete datas.toastId;
    try {
      const config = getConfig();
      const { data } = await axios.put(
        `${baseUrl}/user-portfolio/delete-portfolio`,
        datas,
        config
      );
      if (data) {
        toast.success("Successfully deleted your portfolio.", {
          id: toastId,
        });

        dispatch(dashboardReset());
        dispatch(getDashboardGraph());
        dispatch(getDashboardTable());

        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const addNewPortfolio = createAsyncThunk(
  "portfolio/addNewPortfolio",
  async ({ formData, setIsOpen }, {dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user-portfolio/add-new-portfolio`,
        formData,
        config
      );

      if (data) {
        setIsOpen(false);
        dispatch(dashboardReset());
        dispatch(getDashboardGraph());
        dispatch(getDashboardTable());
        return data;
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 429){
        dispatch(setApiLimitError(true));
      }
    }
  }
);
