import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, getConfig } from "../Api";
import axios from "axios";
import { setApiLimitError} from "../Features/core";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await axios.patch(
        `${baseUrl}/user/update-profile`,
        {
          userData,
        },
        config
      );
      if (status === 200) {
        showToast("Profile updated Succesfully", "success");
      } else {
        showToast("Something went wrong", "error");
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

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async ({ showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const {data} = await axios.get(`${baseUrl}/user/get-profile`, config);
      return data;
    } catch (error) {
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast("Something went wrong!", "error");
      console.log(error);
    }
  }
);

export const getPlanDetails = createAsyncThunk(
  "user/getPlanDetails",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/subscription/get-plan-details`,
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

export const getUpiPayment = createAsyncThunk(
  "user/getUpiPayment",
  async (formData, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/payment/get-upi-details`,
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

export const uploadUpiPaymentDetails = createAsyncThunk(
  "user/uploadUpiPaymentDetails",
  async ({ formData, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/payment/upload-upi-payment-details`,
        formData,
        config
      );
      if (data) {
        navigate("/upi-update-status", { state: formData.txnid });
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

export const getReferData = createAsyncThunk(
  "user/getReferData",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/user/get-refer-data`,
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
  "user/getTutorialVideos",

  async (_,{dispatch}) => {
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
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const addUploadProgress = createAsyncThunk(
  "user/addUploadProgress",
  async (data) => {
    // return data;
  }
);

export const clearUserState = createAsyncThunk(
  "user/clearUserState",
  async () => {
    localStorage.clear();
    return "success.";
  }
);
export const clearMainDashboardStateData = createAsyncThunk(
  "user/clearMainDashboardStateData",
  async () => {
    return "success.";
  }
);


export const generatePortfolio = createAsyncThunk(
  "user/generatePortfolio",
  async ({ userData, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { status, data } = await axios.post(
        `${baseUrl}/user/generate-portfolio`,
        {
          userData,
        },
        config
      );
      const { UserData } = data;
      if (status === 200) {
        navigate("/user/plans");
      }
      return UserData;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const payumoneyPayment = createAsyncThunk(
  "user/payumoneyPayment",
  async (details, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/payment/pay-u-money`,
        details,
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

export const setUser = createAsyncThunk("user/setUser", async (data) => {
  try {
    return data;
  } catch (error) {}
});

export const uploadInvestDetails = createAsyncThunk(
  "user/uploadInvestDetails",
  async ({ formData, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/investment-verification/upload-invest-details`,
        formData,
        config
      );
      if (data) {
        toast.success("Investment details updated successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate(-1);
        }, 3000);
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

//generate new password

export const generatePortfolioPart1 = createAsyncThunk(
  "user/generatePortfolioPart1",
  async ({ formData, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await axios.post(
        `${baseUrl}/user/update-portfolio-part1`,
        formData,
        config
      );
      if (status === 200) {
        navigate("/");
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

export const generatePortfolioPart2 = createAsyncThunk(
  "user/generatePortfolioPart2",
  async ({ formData, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await axios.post(
        `${baseUrl}/user/update-portfolio-part2`,
        formData,
        config
      );
      if (status === 200) {
        navigate("/user/portfolio-dashboard");
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

export const sendEmail = createAsyncThunk(
  "user/sendEmail",
  async ({ email, navigate }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user/send-mail`,
        { email },
        config
      );
      if (data) {
        navigate("/mail-send-success");
        return data;
      }
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

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ password, token, navigate, toast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { status, data } = await axios.post(
        `${baseUrl}/user/update-password/${token}`,
        { password },
        config
      );
      if (status === 200) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (error) {
      const { message } = error.response.data;

      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    }
  }
);

export const getUserNotificationCount = createAsyncThunk(
  "user/getUserNotificationCount",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `/user/get-user-notification-count`,
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
export const getAdminNotificationCount = createAsyncThunk(
  "user/getAdminNotificationCount",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `/admin/get-admin-notification-count`,
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

export const getSubscriptionDetails = createAsyncThunk(
  "user/getSubscriptionDetails",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/subscription/subscription-details`,
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

export const addNewPortfolio = createAsyncThunk(
  "user/addNewPortfolio",
  async ({ formData, setIsOpen }, { dispatch }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/user-portfolio/add-new-portfolio`,
        formData
      );

      if (data) {
        setIsOpen(false);
        dispatch(clearMainDashboardStateData());
        localStorage.removeItem("dashboardGraphData");
        localStorage.removeItem("tableData");
        localStorage.removeItem("totalGainDetails");

        dispatch(getDashboardGraphData());
        dispatch(getDashboardTable());

        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getDashboardPortfolioData = createAsyncThunk(
  "user/getDashboardPortfolioData",
  async ({ setIsOpen, pstatus }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data, status } = await axios.get(
        `${baseUrl}/user-portfolio/getAllPortfolios-and-first-portfolio-data`,
        config
      );

      if (data?.portfolios?.length === 0 && pstatus === "active") {
        setIsOpen(true);
      }
      return { data, status };
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
      if (error.response.data.message === "No Data") {
        setIsOpen(true);
      }
      const { status } = error.response;
      if (status === 400) {
        return { status };
      }
    }
  }
);

export const getSingleStockDetails = createAsyncThunk(
  "user/getSingleStockDetails",
  async (datas, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user-portfolio/get-single-stocktobuy`,
        datas,
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
export const getUserSingleStockDetails = createAsyncThunk(
  "user/getUserSingleStockDetails",
  async (portfolioId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/self-created-portfolios/get-self-created-single-portfolio-stocklist/${portfolioId}`,
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

export const getSinglePortfolioData = createAsyncThunk(
  "user/getSinglePortfolioData",
  async (datas, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/user-portfolio/get-single-portfolio`,
        datas,
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

export const getSettings = createAsyncThunk(
  "user/getSettings",
  async (portfolioId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/user-portfolio/get-single-settings/${portfolioId}`,
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

export const deletePortfolio = createAsyncThunk(
  "user/deletePortfolio",
  async (datas, { dispatch }) => {
    const id = datas.t;
    delete datas.t;
    try {
      const config = getConfig();
      const { data } = await axios.put(
        `${baseUrl}/user-portfolio/delete-portfolio`,
        datas,
        config
      );
      if (data) {
        toast.success("Successfully deleted your portfolio.", {
          id,
        });
        dispatch(getDashboardGraphData());
        dispatch(getDashboardTable());

        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
export const deleteUserCreatedPortfolio = createAsyncThunk(
  "user/deleteUserCreatedPortfolio",
  async (datas, { dispatch }) => {
    const { portfolioId, t } = datas;
    try {
      const config = getConfig();
      const { data } = await axios.delete(
        `${baseUrl}/self-created-portfolios/delete-self-created-single-portfolio/${portfolioId}`,
        config
      );
      if (data) {
        toast.success("Successfully deleted your portfolio.", {
          t,
        });
        dispatch(clearMainDashboardStateData());
        localStorage.removeItem("dashboardGraphData");
        localStorage.removeItem("tableData");
        localStorage.removeItem("totalGainDetails");

        dispatch(getDashboardGraphData());
        dispatch(getDashboardTable());

        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const editPortfolioSettings = createAsyncThunk(
  "user/editPortfolioSettings",
  async (datas, { dispatch }) => {
    const id = datas.t;
    delete datas.t;
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/user-portfolio/edit-portfolio`,
        datas,
        config
      );

      if (data) {
        toast.success("Successfully edited Portfolio details", {
          id: id,
        });
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getDashboardTable = createAsyncThunk(
  "user/getDashboardTable",
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
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getDashboardGraphData = createAsyncThunk(
  "user/getDashboardGraphData",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/user-portfolio/get-dashboard-graph-data`,
        config
      );

      return data;
    } catch (error) {
      console.log(error);
      const { status } = error.response;
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else if (status === 400) {
        return status;
      }
    }
  }
);

export const getStatus = createAsyncThunk(
  "user/getStatus",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(`${baseUrl}/user/get-status`, config);
      if (data) {
        localStorage.setItem(
          "status",
          JSON.stringify({ status: data?.status })
        );
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

export const RoutingAfterPayment = createAsyncThunk(
  "user/RoutingAfterPayment",
  async (navigate, { dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/user/routing-after-payment`);
      if (data) {
        localStorage.setItem("status", JSON.stringify({ status: "active" }));
        navigate("/dashboard");

        return data;
      }
    } catch (error) {
      console.log(error);
      const { status } = error.response;
      if (status === 400) {
        localStorage.setItem("status", JSON.stringify({ status: "active" }));
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      } else if (status === 401) {
        localStorage.setItem("status", JSON.stringify({ status: "active" }));
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);


export const unSubscribePushNotification = createAsyncThunk("user/unSubscribePushNotification",async()=>{
  try {
     const registration = await navigator.serviceWorker.ready;
     const subscription = await registration.pushManager.getSubscription();
     if(subscription !== null){
      await subscription.unsubscribe();

      // Remove the subscription from the server
      const config = getConfig();
      await axios.post(`${baseUrl}/web-push/unsubscribe`, { subscription }, config);
     }
  } catch (error) {
    console.error('Error during unsubscribe or server request:', error);
  }
})