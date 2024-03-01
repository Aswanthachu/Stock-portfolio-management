import { createSlice } from "@reduxjs/toolkit";
import {
  addNewPortfolio,
  deletePortfolio,
  editPortfolioName,
  getDashboardPortfolioData,
  getSettings,
  getSinglePortfolioData,
  getSingleStockDetails,
} from "../Actions/portfolio";

const initialState = {
  statusByName: {},
  dataByName: {},
  portfolios: [],
  tableData: {},
  graphData: {},
  currentPortfolioId: "",
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    resetState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardPortfolioData.pending, (state, action) => {
        state.statusByName["getDashboardPortfolioData"] = "pending";
      })
      .addCase(getDashboardPortfolioData.fulfilled, (state, action) => {
        const { data, portfolios } = action.payload;

        return {
          ...state,
          portfolios,
          tableData: data.dashboardTableData,
          graphData: data.dashboardGraphData,
          currentPortfolioId: data.portfolioId,
          currentUSDValue:data.currentUSDValue,
          stockLogo:data.stockLogo,
          stockSymbol:data.stockSymbol,
          statusByName: {
            ...state.statusByName,
            ["getDashboardPortfolioData"]: "fulfilled",
          },
        };
      })
      .addCase(getDashboardPortfolioData.rejected, (state, action) => {
        state.statusByName["getDashboardPortfolioData"] = "rejected";
      })
      .addCase(getSingleStockDetails.pending, (state, action) => {
        state.statusByName["getSingleStockDetails"] = "pending";
      })
      .addCase(getSingleStockDetails.fulfilled, (state, action) => {
        state.statusByName["getSingleStockDetails"] = "fulfilled";
        state.dataByName["getSingleStockDetails"] =
          action.payload?.userBuyedStock;
      })
      .addCase(getSingleStockDetails.rejected, (state, action) => {
        state.statusByName["getSingleStockDetails"] = "rejected";
      })
      .addCase(getSettings.pending, (state, action) => {
        state.statusByName["getSettings"] = "pending";
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.statusByName["getSettings"] = "fulfilled";
        state.dataByName["getSettings"] = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.statusByName["getSettings"] = "rejected";
      })
      .addCase(getSinglePortfolioData.pending, (state, action) => {
        state.statusByName["getDashboardPortfolioData"] = "pending";
      })
      .addCase(getSinglePortfolioData.fulfilled, (state, action) => {
        const { data } = action.payload;
        return {
          ...state,
          tableData: data.dashboardTableData,
          graphData: data.dashboardGraphData,
          currentPortfolioId: data.portfolioId,
          stockLogo: data.stockLogo,
          statusByName: {
            ...state.statusByName,
            ["getDashboardPortfolioData"]: "fulfilled",
          },
        };
      })
      .addCase(getSinglePortfolioData.rejected, (state, action) => {
        state.statusByName["getDashboardPortfolioData"] = "rejected";
      })
      .addCase(editPortfolioName.pending, (state, action) => {
        state.statusByName["editPortfolioName"] = "pending";
      })
      .addCase(editPortfolioName.fulfilled, (state, action) => {
        const { _id: portfolioId, portfolioname: portfolio_name } =
          action.payload.editedPortfolio;

        const portfolioIndex = state.portfolios.findIndex(
          (portfolio) => portfolio.portfolioId === portfolioId
        );

        if (portfolioIndex !== -1) {
          state.statusByName["editPortfolioName"] = "fulfilled";
          state.portfolios[portfolioIndex].portfolio_name = portfolio_name;
          const updatedPortfolio = state.portfolios.splice(
            portfolioIndex,
            1
          )[0];
          state.portfolios.unshift(updatedPortfolio);
        }
      })
      .addCase(editPortfolioName.rejected, (state, action) => {
        state.statusByName["editPortfolioName"] = "rejected";
      })
      .addCase(deletePortfolio.pending, (state, action) => {
        state.statusByName["deletePortfolio"] = "pending";
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        const { portfolioId } = action.payload;
        return {
          ...state,
          statusByName: {
            ...state.statusByName,
            ["deletePortfolio"]: "fulfilled",
          },
          portfolios: state.portfolios.filter(
            (item) => item.portfolioId !== portfolioId
          ),
        };
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.statusByName["deletePortfolio"] = "rejected";
      })
      .addCase(addNewPortfolio.pending, (state, action) => {
        state.statusByName["getDashboardPortfolioData"] = "pending";
      })
      .addCase(addNewPortfolio.fulfilled, (state, action) => {
        const { data, portfolio } = action.payload;
        return {
          ...state,
          tableData: data.dashboardTableData,
          graphData: data.dashboardGraphData,
          portfolios: [portfolio, ...state.portfolios],
          statusByName: {
            ...state.statusByName,
            ["getDashboardPortfolioData"]: "fulfilled",
          },
        };
      })
      .addCase(addNewPortfolio.rejected, (state, action) => {
        state.statusByName["addNewPortfolio"] = "rejected";
      });
  },
});

export default portfolioSlice.reducer;

export const { resetState } = portfolioSlice.actions;

export const selectStatusByName = (state, name) =>
  state.portfolio.statusByName[name];
export const selectDataByName = (state, name) =>
  state.portfolio.dataByName[name];
