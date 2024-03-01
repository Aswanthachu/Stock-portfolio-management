import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDataByName, selectStatusByName } from "../Features/portfolio";
import {
  getDashboardPortfolioData,
  getSettings,
  getSingleStockDetails,
} from "../Actions/portfolio";

export function getDashboardPortfolioDataQuery(reqData) {
  const dispatch = useDispatch();

  const name = "getDashboardPortfolioData";
  const status = useSelector((state) => selectStatusByName(state, name));
  const portfolios = useSelector((state) => state.portfolio.portfolios);
  const tableData = useSelector((state) => state.portfolio.tableData);
  const graphData = useSelector((state) => state.portfolio.graphData);
  const portfolioId=useSelector(state=>state.portfolio.currentPortfolioId)
  const stockLogo=useSelector(state=>state.portfolio.stockLogo)
  const stockSymbol=useSelector(state=>state.portfolio.stockSymbol)

  const data = { portfolios, tableData, graphData,portfolioId ,stockLogo, stockSymbol};

  useEffect(() => {
    if (status === undefined) {
      dispatch(getDashboardPortfolioData(reqData));
    }
  }, [status, name, dispatch]);

  const isUninitialized = status === undefined;
  const isLoading = status === "pending" || status === undefined;
  const isError = status === "rejected";
  const isSuccess = status === "fulfilled";

  return { data, isUninitialized, isLoading, isError, isSuccess };
}

export function getSettingsQuery(reqData) {
  const dispatch = useDispatch();

  const name = "getSettings";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  const newportfoliocreated=JSON.parse(localStorage.getItem("firstportfolio"));

  useEffect(() => {
    if (status === undefined && !newportfoliocreated) {
      dispatch(getSettings(reqData));
    }
  }, [status, name, dispatch]);

  const isUninitialized = status === undefined;
  const isLoading = status === "pending" || status === undefined;
  const isError = status === "rejected";
  const isSuccess = status === "fulfilled";

  return { data, isUninitialized, isLoading, isError, isSuccess };
}

export function getSingleStockDetailsQuery(reqData) {
  const dispatch = useDispatch();

  const name = "getSingleStockDetails";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getSingleStockDetails(reqData));
    }
  }, [status, name, dispatch]);

  const isUninitialized = status === undefined;
  const isLoading = status === "pending" || status === undefined;
  const isError = status === "rejected";
  const isSuccess = status === "fulfilled";

  return { data, isUninitialized, isLoading, isError, isSuccess };
}
