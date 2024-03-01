import { createSlice } from "@reduxjs/toolkit";
import {
  getPlanDetails,
  getProfile,
  updateProfile,
  getUpiPayment,
  getReferData,
  getTutorialVideos,
} from "../Actions/user";
const initialState ={
  userData: "",
  userSettingsData: "",
  userDashBoardTableData: [],
  userDashBoardGainDetails: {},
  dashboardGraphData: {},
  stocksTobuy: [],
  totalPercentage: 0,
  paymentData: {},
  errorMessage: "",
  referData: {},
  subscriptionStatus: "",
  loading: false,
  subloading: false,
  tokens: [],
  upiPaymentData: {},
  currentPlanDetails: {},
  portfolioData: {},
  totalPortfolios: [],
  stocklist: [],
  portfolioSettings: {},
  subscriptionDetails: {},
  showTour: false,
  tutorialVideos: [],
  createPortfolioLoading: false,
  recentTransactions:[],
  recentTransactionsLoading:false,

}
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      localStorage.clear()
      return initialState;
    },
    setErrors: (state, action) => {
      const { message } = action.payload;
      return {
        ...state,
        errorMessage: message,
      };
    },
    clearErrorMessages: (state) => {
      return {
        ...state,
        errorMessage: "",
      };
    },
    setTour: (state) => {
      return {
        ...state,
        showTour: true,
      };
    },
    clearTour: (state) => {
      return {
        ...state,
        showTour: false,
      };
    },
    calculateTotalPercentage: (state, action) => {
      const stocks = action.payload;
      let totPercent = 0;

      for (let i = 0; i < stocks?.length; i++) {
        const { percentage_of_portfolio } = stocks[i];
        totPercent += percentage_of_portfolio;
      }
      return {
        ...state,
        totalPercentage: totPercent,
      };
    },
    setStatus: (state, action) => {
      const status = action.payload;
      return {
        ...state,
        subscriptionStatus: status,
      };
    },
    emptyPortfolioData: (state, action) => {
      return {
        ...state,
        stocklist: [],
        portfolioData: {},
      };
    },
    setSubloading: (state) => {
      return {
        ...state,
        subloading: false,
      };
    },
    setLoading: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      const { name, profilePic } = action.payload.userSettingsData;
      const loginedUser = JSON.parse(localStorage.getItem("user"))

      localStorage.setItem(
        "user",
        JSON.stringify({  ...loginedUser, name, profilePic  })
      );
    }),
      builder.addCase(getProfile.pending, (state, action) => {
        return {
          ...state,
          loading: true,
        };
      }),
      builder.addCase(getProfile.fulfilled, (state, action) => {
        const { userSettingsData, currentPlanDetails } = action.payload;
        return {
          ...state,
          loading: false,
          userSettingsData,
          currentPlanDetails
        };
      }),
      builder.addCase(getPlanDetails.pending, (state, action) => {
        return {
          ...state,
          recentTransactionsLoading:true,
        };
      }),
      builder.addCase(getPlanDetails.fulfilled, (state, action) => {
        const { recentTransactions } = action.payload;
        return {
          ...state,
          recentTransactions,
          recentTransactionsLoading:false,

        };
      }),
      builder.addCase(getUpiPayment.fulfilled, (state, action) => {
        const data = action.payload;
        return {
          ...state,
          upiPaymentData: data,
        };
      }),
      builder.addCase(getReferData.fulfilled, (state, action) => {
        const referData = action.payload;
        return {
          ...state,
          referData: referData,
        };
      }),
      builder.addCase(getTutorialVideos.fulfilled, (state, action) => {
        const data = action.payload;
        return {
          ...state,
          tutorialVideos: data?.tutorialVideos,
        };
      });
  },
});

export default userSlice.reducer;
export const {
  resetState,
  calculateTotalPercentage,
  setErrors,
  clearErrorMessages,
  setStatus,
  emptyPortfolioData,
  setSubloading,
  setLoading,
  setTour,
  clearTour,
} = userSlice.actions;
