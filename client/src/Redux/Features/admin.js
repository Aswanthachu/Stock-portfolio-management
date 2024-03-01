import { createSlice } from "@reduxjs/toolkit";

import {
  addNewStocks,
  getAllStocks,
  editStock,
  addBulkStocks,
  getAllUsers,
  getSingleUser,
  getCoupons,
  createCoupon,
  deleteCoupon,
  updateUserRole,
  getAllInvestmentVerificationDetails,
  getInvestmentScreenshot,
  getUserInvestmentDetails,
  editStockDetails,
  getUserPortfolioTable,
  getAdminDashboardData,
  getRevenueDetails,
  getunVerifiedUpi,
  verifyUpiPayment,
  rejectUpiPayment,
  getTutorialVideos,
  getUserSubscriptionDetails,
  extendUserPlan,
  cancelUserPlan,
  addPlan,
  setActiveUsers,
  getSubadminActivities,
  getUserActivities,
  deleteStock,
  getNotificationEnabledUsers
} from "../Actions/admin";

const initialState = {
  stockData: [],
  totalPercentage: 0,
  users: [],
  userDetails: {},
  coupons: [],
  tokenData: [],
  investmentVerificationDetails: [],
  singleInvestmentDetails: {},
  stockDetails: {},
  userPortfolioTableData: [],
  loading: false,
  dashboardData: {},
  revenueDetails: {},
  unverifiedPayment: [],
  notificationCount: {},
  tutorialVideos: [],
  dataByName: {},
  statusByName: {},
  userSubscriptionDetails:[],
  userSubscriptionDetailsLoading:false,
  activeUsers:[],
  subAdminActivities:[],
  subAdminActivitiesLoading:false,
  userActivities:[],
  activitiesLoading:false,
  notificationEnabledUsers:[]
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
    calculateTotalPercentage: (state, action) => {
      const { stocks } = action.payload;

      let totPercent = 0;
      for (let i = 0; i < stocks?.length; i++) {
        const { percentage_portfolio, active } = stocks[i];
        if (active) {
          totPercent += percentage_portfolio;
        }
      }
      return {
        ...state,
        totalPercentage: totPercent,
      };
    },
    setLoading: (state, action) => {
      const loading = action.payload;
      return {
        ...state,
        loading,
      };
    },
    deleteStockFromState: (state, action) => {
      const { stocks, id } = action.payload;

      return {
        ...state,
        stockData: stocks.filter((stk) => stk._id !== id),
      };
    },
    clearAdminStateData: (state) => {
      return {
        ...state,
        stockData: [],
        totalPercentage: 0,
        users: [],
        userDetails: {},
        coupons: [],
        tokenData: [],
        investmentVerificationDetails: [],
        singleInvestmentDetails: {},
        stockDetails: {},
        userPortfolioTableData: [],
        loading: false,
        dashboardData: {},
        revenueDetails: {},
        unverifiedPayment: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewStocks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addNewStocks.fulfilled, (state, action) => {
        const { newStock } = action.payload;
        (state.loading = false), (state.stockData = newStock);
      })
      .addCase(getAllStocks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllStocks.fulfilled, (state, action) => {
        const { stocks } = action.payload;
        (state.loading = false), (state.stockData = stocks);
      })
      .addCase(editStock.fulfilled, (state, action) => {
        const { updatedData } = action.payload;
        state.stockData = [
          ...state.stockData.map((stk) =>
            stk._id === updatedData._id ? updatedData : stk
          ),
        ];
      })
      .addCase(addBulkStocks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addBulkStocks.fulfilled, (state, action) => {
        const { stocks } = action.payload;
        (state.loading = false), (state.stockData = stocks);
      })
      .addCase(getAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false), (state.users = data);
      })
      .addCase(getSingleUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false), (state.userDetails = data);
      })
      .addCase(getCoupons.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false), (state.coupons = data);
      })
      .addCase(createCoupon.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false), (state.coupons = data);
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        const data = action.payload;

        state.coupons = data?.activeCoupons;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {})

      .addCase(getAllInvestmentVerificationDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        getAllInvestmentVerificationDetails.fulfilled,
        (state, action) => {
          const { data } = action.payload;

          (state.loading = false), (state.investmentVerificationDetails = data);
        }
      )

      .addCase(getInvestmentScreenshot.fulfilled, (state, action) => {
        const { data, status } = action.payload;

        if (status === 200) {
          state.singleInvestmentDetails = data;
        } else {
          state.singleInvestmentDetails = {};
        }
      })
      .addCase(getUserInvestmentDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserInvestmentDetails.fulfilled, (state, action) => {
        const { data, status } = action.payload;
        if (status === 200) {
          const { singleStock } = data;
          state.stockDetails = singleStock;
        } else {
          state.stockDetails = {};
        }
      })
      .addCase(editStockDetails.fulfilled, (state, action) => {
        const { updatedStocks } = action.payload;
        state.stockDetails = updatedStocks;
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        const { deletedStock } = action.payload;
        if (deletedStock)
          state.stockData = state.stockData.map((stk) =>
            stk._id === deletedStock._id ? {...stk,active:false} : stk
          );
      })
      .addCase(getUserPortfolioTable.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserPortfolioTable.fulfilled, (state, action) => {
        const { data, status } = action.payload;
        if (status === 200) {
          const { tableData } = data;
          (state.loading = false), (state.userPortfolioTableData = tableData);
        } else {
          (state.loading = false),
            (state.userPortfolioTableData = []),
            (state.singleInvestmentDetails = {});
        }
      })
      .addCase(getAdminDashboardData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAdminDashboardData.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false),
          (state.dashboardData = data),
          (state.notificationCount = data?.pCount);
      })
      .addCase(getRevenueDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRevenueDetails.fulfilled, (state, action) => {
        const {
          totalWeekRevenue,
          totalMonthRevenue,
          totalRevenue,
          recentTransactions,
        } = action.payload;

        (state.loading = false),
          (state.revenueDetails = {
            totalWeekRevenue,
            totalMonthRevenue,
            totalRevenue,
            recentTransactions,
          });
      })
      .addCase(getunVerifiedUpi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getunVerifiedUpi.fulfilled, (state, action) => {
        const data = action.payload;

        (state.loading = false), (state.unverifiedPayment = data);
      })
      .addCase(verifyUpiPayment.fulfilled, (state, action) => {
        const data = action.payload;

        (state.unverifiedPayment = data),
          (state.notificationCount = data?.pCount);
      })
      .addCase(rejectUpiPayment.fulfilled, (state, action) => {
        const data = action.payload;

        state.unverifiedPayment = data;
      })
      .addCase(getTutorialVideos.fulfilled, (state, action) => {
        const data = action.payload;
        state.tutorialVideos = data?.tutorialVideos;
      })
      .addCase(getUserSubscriptionDetails.pending, (state) => {
        state.userSubscriptionDetailsLoading = true;
      })
      .addCase(getUserSubscriptionDetails.fulfilled, (state, action) => {
        const { subscriptions } = action.payload;
        state.userSubscriptionDetails = subscriptions;
        state.userSubscriptionDetailsLoading = false;
      })
      .addCase(extendUserPlan.pending, (state) => {
        state.userSubscriptionDetailsLoading = true;
      })
      .addCase(extendUserPlan.fulfilled, (state, action) => {
        const { subscriptions } = action.payload;
        state.userSubscriptionDetails = subscriptions;
        state.userSubscriptionDetailsLoading = false;
      })
      .addCase(cancelUserPlan.pending, (state) => {
        state.userSubscriptionDetailsLoading = true;
      })
      .addCase(cancelUserPlan.fulfilled, (state, action) => {
        const { subscriptions } = action.payload;
        state.userSubscriptionDetails = subscriptions;
        state.userSubscriptionDetailsLoading = false;
      })
      .addCase(addPlan.pending, (state) => {
        state.userSubscriptionDetailsLoading = true;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        const { subscriptions } = action.payload;
        state.userSubscriptionDetails = subscriptions;
        state.userSubscriptionDetailsLoading = false;
      })
      .addCase(setActiveUsers.fulfilled, (state, action) => {
        state.activeUsers = action.payload;
      })
      .addCase(getSubadminActivities.fulfilled, (state, action) => {
        state.subAdminActivities = action.payload;
        state.activitiesLoading = false;
      })
      .addCase(getSubadminActivities.pending, (state, action) => {
        state.activitiesLoading = true;
      })
      .addCase(getUserActivities.fulfilled, (state, action) => {
        state.userActivities = action.payload;
        state.activitiesLoading = false;
      })
      .addCase(getUserActivities.pending, (state, action) => {
        state.activitiesLoading = true;
      })
      .addCase(getNotificationEnabledUsers.fulfilled,(state,action)=>{
        const {notificationEnabledUsers} = action.payload
        state.notificationEnabledUsers = notificationEnabledUsers
      })
  },  
});

export default adminSlice.reducer;

export const {
  resetState,
  calculateTotalPercentage,
  setLoading,
  // deleteStockFromState,
  clearAdminStateData,
} = adminSlice.actions;

export const selectStatusByName = (state, name) =>
  state.admin.statusByName[name];
export const selectDataByName = (state, name) => state.admin.dataByName[name];
