import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api, baseUrl, getConfig } from "../Api/index.js";
import { setApiLimitError} from "../Features/core.js";

export const addNewStocks = createAsyncThunk(
  "admin/addNewStocks",
  async ({ formData }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/admin/portfolio/add-new-stocks`,
        { ...formData },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const addBulkStocks = createAsyncThunk(
  "admin/addBulkStocks",
  async ({ csv }, { dispatch }) => {
    try {
      const config = getConfig();

      const { data } = await axios.post(
        `${baseUrl}/admin/portfolio/add-new-stocks-csv`,
        { csv },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getAllStocks = createAsyncThunk(
  "admin/getAllStocks",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/admin/portfolio/get-all-stocks`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const editStock = createAsyncThunk(
  "admin/editStock",
  async ({ formData, id }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/admin/portfolio/edit-stocks/${id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const deleteStock = createAsyncThunk(
  "admin/deleteStock",
  async ({ id }, { dispatch }) => {
    try {
      const config = getConfig();
      const {data}=await axios.delete(
        `${baseUrl}/admin/portfolio/delete-stocks/${id}`,
        config
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await api.get(`/admin/get-all-user`, config);
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await api.get(`/admin/get-single-user/${id}`, config);
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
export const getSubadminActivities = createAsyncThunk(
  "admin/getSubadminActivities",
  async (id) => {
    try {
      const config = getConfig();
      const { data } = await api.get(`/admin/get-sub-admin-activities/${id}`, config);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getUserActivities = createAsyncThunk(
  "admin/getUserActivities",
  async (id) => {
    try {
      const config = getConfig();
      const { data } = await api.get(`/admin/get-user-activities/${id}`, config);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCoupons = createAsyncThunk(
  "admin/getCoupons",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/coupons/get-all-coupons`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
export const createCoupon = createAsyncThunk(
  "admin/createCoupon",
  async (newCoupon, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/coupons/create-coupon`,
        newCoupon,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",
  async (couponId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/coupons/delete-coupon`,
        couponId,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async (details, { dispatch }) => {
    try {
      const config = getConfig();
      await axios.patch(`${baseUrl}/admin/update-user-role`, details, config);
      return details;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

// action for getting all investment verification details from backend

export const getAllInvestmentVerificationDetails = createAsyncThunk(
  "admin/getAllInvestmentVerificationDetails",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/investment-verification/get-invest-Details`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getInvestmentScreenshot = createAsyncThunk(
  "admin/getInvestmentScreenshot",
  async ({ pid }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await api.get(
        `/investment-verification/get-single-details/${pid}`,
        config
      );
      return { data: data.data, status };
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
      const { data, status } = error.response;
      return { data, status };
    }
  }
);

export const getUserInvestmentDetails = createAsyncThunk(
  "admin/getUserInvestmentDetails",
  async ({ pid, itype }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await api.get(
        `/investment-verification/get-single-stock-details/${pid}/${itype}`,
        config
      );
      return { data, status };
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const editStockDetails = createAsyncThunk(
  "admin/editStockDetails",
  async ({ pid, itype, stock, gPId, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/investment-verification/verify-investment/${pid}`,
        { stock, type: itype, gPId },
        config
      );
      if (data) {
        showToast(`Successfully edited Portfolio Details`, "success");
      }
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getAdminDashboardData = createAsyncThunk(
  "admin/getAdminDashboardData",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/admin/get-dashboard-data`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getUserPortfolioTable = createAsyncThunk(
  "admin/getUserPortfolioTable",
  async ({ pid, itype }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await axios.get(
        `${baseUrl}/admin/get-user-portfolio-table/${pid}/${itype}`,
        config
      );
      return { data, status };
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
      const { response } = error;
      return response;
    }
  }
);

export const getRevenueDetails = createAsyncThunk(
  "admin/getRevenueDetails",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/admin/get-revenue-details`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getunVerifiedUpi = createAsyncThunk(
  "admin/getunVerifiedUpi",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/payment/get-un-verified-payments`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const verifyUpiPayment = createAsyncThunk(
  "admin/verifyUpiPayment",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/payment/verify-upi-payment`,
        id,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const rejectUpiPayment = createAsyncThunk(
  "admin/rejectUpiPayment",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/payment/reject-upi-payment`,
        id,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getTutorialVideos = createAsyncThunk(
  "admin/getTutorialVideos",

  async (showToast, { dispatch }) => {
    try {
      const config = getConfig();

      const { data } = await axios.get(
        `${baseUrl}/tutorials/get-tutorial-videos`,
        config
      );
      if (data) {
        return data;
      }
    } catch (error) {
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);
export const addTutorialVideo = createAsyncThunk(
  "admin/addTutorialVideos",

  async ({ formData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();

      const { data } = await axios.post(
        `${baseUrl}/tutorials/add-tutorial-video`,
        formData,
        config
      );
      if (data) {
        showToast("Video Added Successfully", "success");
        return data;
      }
    } catch (error) {
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);

export const editTutorialVideo = createAsyncThunk(
  "admin/editTutorialVideo",
  async ({ videoData, showToast, navigate }, { dispatch }) => {
    try {
      const response = await axios.put(
        `${baseUrl}/tutorials/edit-tutorial-video/${videoData.embedCode}`,
        videoData
      );
      if (response.status === 200) {
        showToast("Video edited Successfully", "success");
        navigate("/tutorials");
        return response.data;
      } else {
        // Handle error
      }
    } catch (error) {
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        showToast(
          `${error?.response?.data?.message || "Some thing went wrong"}`,
          "error"
        );
    }
  }
);
export const deleteTutorialVideo = createAsyncThunk(
  "admin/deleteTutorialVideo",

  async ({ embedCode, showToast }, { dispatch }) => {
    try {
      const config = getConfig();

      const { data } = await axios.delete(
        `${baseUrl}/tutorials/delete-tutorial-video/${embedCode}`,
        config
      );
      if (data) {
        showToast("Video deleted Successfully", "success");

        return data;
      }
    } catch (error) {
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);

export const getUserSubscriptionDetails = createAsyncThunk(
  "admin/getUserSubscriptionDetails",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/subscription/get-user-subscription-details/${id}`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
export const extendUserPlan = createAsyncThunk(
  "admin/extendUserPlan",
  async ({ formData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/subscription/extend-user-subscription`,
        formData,
        config
      );
      if (data) {
        showToast(data.message, "success");
      }
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);
export const cancelUserPlan = createAsyncThunk(
  "admin/cancelUserPlan",
  async ({ formData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/subscription/cancel-user-subscription`,
        formData,
        config
      );
      if (data) {
        showToast(data.message, "success");
      }
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);
export const addPlan = createAsyncThunk(
  "admin/AddPlan",
  async ({ formData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/subscription/add-user-subscription`,
        formData,
        config
      );
      if (data) {
        showToast(data.message, "success");
      }
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast(`${error?.response?.data?.message}`, "error");
    }
  }
);

export const setActiveUsers = createAsyncThunk(
  "admin/setActiveUsers",
  (activeUsers) => activeUsers
);


export const getNotificationEnabledUsers = createAsyncThunk('admin/getNotificationEnabledUsers',async()=>{
  try {
    const config = getConfig();
    const { data } = await axios.get(`${baseUrl}/web-push/get-notification-enabled-users`, config );
    return data
  } catch (error) {
    console.log(error)
  }
})