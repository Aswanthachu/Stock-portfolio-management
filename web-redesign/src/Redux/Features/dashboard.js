import { createSlice } from "@reduxjs/toolkit";
import { getDashboardGraph, getDashboardTable } from "../Actions/dashboard";
const initialState = {
  dataByName: {},
  statusByName: {},
};
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getDashboardTable.pending, (state, action) => {
      state.statusByName["getDashboardTable"] = "pending";
    })
    .addCase(getDashboardTable.fulfilled, (state, action) => {
      state.statusByName["getDashboardTable"] = "fulfilled";
      state.dataByName["getDashboardTable"] = action.payload;
    })
    .addCase(getDashboardTable.rejected, (state, action) => {
      state.statusByName["getDashboardTable"] = "rejected";
    })
    .addCase(getDashboardGraph.pending, (state, action) => {
      state.statusByName["getDashboardGraph"] = "pending";
    })
    .addCase(getDashboardGraph.fulfilled, (state, action) => {
      state.statusByName["getDashboardGraph"] = "fulfilled";
      state.dataByName["getDashboardGraph"] = action.payload;
    })
    .addCase(getDashboardGraph.rejected, (state, action) => {
      state.statusByName["getDashboardGraph"] = "rejected";
    });
  },
});

export default dashboardSlice.reducer;
export const { resetState } = dashboardSlice.actions;
export const selectStatusByName = (state, name) =>
  state.dashboard.statusByName[name];
export const selectDataByName = (state, name) =>
  state.dashboard.dataByName[name];
