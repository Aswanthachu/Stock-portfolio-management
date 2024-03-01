import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateNewPortfolio from "@/components/Popups/CreateNewPortfolio";
import {
  Graph,
  Table,
  TopSection,
  Tabs,
  PortfolioSettings,
  NoPortfolioData,
} from "@/components";

import {
  getDashboardPortfolioDataQuery,
  getSettingsQuery,
  getSingleStockDetailsQuery,
} from "@/Redux/hooks/portfolio";

import { headings, headings2 } from "@/lib/constants/userDashboardTableHeading";
import {
  getSettings,
  getSinglePortfolioData,
  getSingleStockDetails,
} from "@/Redux/Actions/portfolio";

const Portfolio = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [selectedPortfolio, setSelectedPortfolio] = useState({});

  const { status } = JSON.parse(localStorage.getItem("status"))
    ? JSON.parse(localStorage.getItem("status"))
    : "";

  const {
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewError,
  } = getDashboardPortfolioDataQuery();

  useEffect(() => {
    if (
      selectedTab === "Stock List" &&
      selectedPortfolio &&
      Object.keys(selectedPortfolio)?.length > 0
    )
      dispatch(
        getSingleStockDetails({
          portfolioId: selectedPortfolio?.portfolioId,
          investmentType: selectedPortfolio?.investmentType,
        })
      );
    else if (
      selectedTab === "Settings" &&
      selectedPortfolio &&
      Object.keys(selectedPortfolio)?.length > 0
    ) {
      dispatch(getSettings({ portfolioId: selectedPortfolio?.portfolioId }));
    } else if (
      selectedTab === "Overview" &&
      selectedPortfolio &&
      Object.keys(selectedPortfolio)?.length > 0
    ) {      
      if (selectedPortfolio.portfolioId !== overviewData.portfolioId)
        dispatch(
          getSinglePortfolioData({
            portfolioId: selectedPortfolio?.portfolioId,
            investmentType: selectedPortfolio?.investmentType,
          })
        );
    }
  }, [selectedPortfolio, selectedTab]);

  useEffect(() => {
    setSelectedPortfolio(overviewData?.portfolios[0]);
  }, [overviewData.portfolios]);

  const portfolios = useSelector((state) => state.portfolio?.portfolios);

  useEffect(() => {
    setSelectedPortfolio(portfolios[0]);
    if (portfolios?.length > 0) localStorage.removeItem("firstportfolio");
  }, [portfolios]);

  const {
    data: settingsData,
    isLoading: settingsLoading,
    isError: settingsError,
  } = getSettingsQuery();

  const {
    data: stocklistData,
    isLoading: stocklistLoading,
    isError: stocklistError,
  } = getSingleStockDetailsQuery({
    portfolioId: selectedPortfolio?.portfolioId,
    investmentType: selectedPortfolio?.investmentType,
  });

  return (
    <main className="w-full p-5 md:p-10 lg:px-16 lg:py-10">
      <TopSection
        data={overviewData?.portfolios}
        selectedPortfolio={selectedPortfolio}
        setSelectedPortfolio={setSelectedPortfolio}
        isLoading={overviewLoading}
        setIsOpen={setIsOpen}
        planStatus={status}
      />
      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isLoading={overviewLoading}
      />

      {selectedTab === "Overview" && (
        <>
          <Graph
            data={overviewData?.graphData}
            isLoading={overviewLoading}
            planStatus={status}
          />
          <Table
            columns="grid-cols-4 md:grid-cols-5 lg:grid-cols-8"
            title="Your holding"
            headings={headings}
            data={overviewData.tableData}
            isLoading={overviewLoading}
            planStatus={status}
            usExchangeRate={overviewData.currentUSDValue}
            logo={overviewData?.stockLogo}
            symbol={overviewData?.stockSymbol}
          />
        </>
      )}
      {selectedTab === "Stock List" &&
        overviewData.portfolios?.length !== 0 &&
        status === "active" && (
          <Table
            columns="grid-cols-6"
            title="Stock list"
            headings={headings2}
            data={stocklistData?.stockList}
            logo={stocklistData?.stockLogo}
            symbol={stocklistData?.stockSymbol}
            stocklist
            usExchangeRate={stocklistData?.currentUSDValue}
            isLoading={stocklistLoading}
            planStatus={status}
          />
        )}
      {selectedTab === "Settings" &&
        overviewData.portfolios?.length !== 0 &&
        status === "active" && (
          <PortfolioSettings
            data={settingsData?.portfolioSettings}
            isLoading={settingsLoading}
          />
        )}
      {overviewData.portfolios.length === 0 &&
        !overviewLoading &&
        !stocklistLoading &&
        !settingsLoading &&
        selectedTab !== "Overview" && (
          <NoPortfolioData setIsOpen={setIsOpen} planStatus={status} />
        )}
      <CreateNewPortfolio
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={overviewLoading}
      />
    </main>
  );
};

export default Portfolio;
