import { useState, useEffect } from "react";
import { useDispatch} from "react-redux";
import { getDashboardGraphQuery, getDashboardTableQuery } from "@/Redux/hooks/dashboard";
import { TopGreetingSection, DashboardOverview, Graph, Table, WelcomePopup, WelcomePopupSubscribed, FreeConsultationPopup, TakeATourPopup } from "@/components";
import { getStatus } from "@/Redux/Actions/user";
import CreateNewPortfolio from "@/components/Popups/CreateNewPortfolio";
import { emptyOverviewData } from "@/lib/constants/emptyOverviewData";
import { headings } from "@/lib/constants/userDashboardTableHeading";
// import Hello from "@/components/UserDashboard/Hello";

const UserDashboard = () => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioCreate, setPortfolioCreate] = useState(false);
  const { data: tableData, isError: tableDataError, isLoading: tableDataLoading } = getDashboardTableQuery();
  const { data: graphData, isError: graphDataError, isLoading: graphDataLoading } = getDashboardGraphQuery();
  const [showConsultation, setShowConsultation] = useState(false);
  const [isOpenSub, setIsOpenSub] = useState(false);
  const [isTakeATourOpen, setIsTakeATourOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'))
  const status = JSON.parse(localStorage.getItem("status"))?.status;

  useEffect(() => {
    if (status !== "active") {
      dispatch(getStatus());
    }
  }, [status]);

  console.log("hiii");

  useEffect(() => {
    const popupSubShowed = localStorage.getItem("popupShowedSub") === 'true';
        if (!popupSubShowed && status === 'active'&& user?.portfolios?.length===0) {
      setIsOpenSub(true);
    }
  }, [status, user]);

  useEffect(() => {
    const popupShowed = localStorage.getItem('popupShowed');
    if (popupShowed !== 'true' && status === 'notSubscribed') {
      setIsOpen(true)
    }
  }, [status]);

  console.log(graphData);

  return (
    <main className="w-full p-5 md:p-10 lg:px-16 lg:py-10">
      <TopGreetingSection />
      <DashboardOverview
        totalGainDetails={(tableData?.totalGainDetails && Object.keys(tableData?.totalGainDetails)?.length) > 2
            ? tableData?.totalGainDetails
            : { ...tableData?.totalGainDetails, ...emptyOverviewData }
        }
        isLoading={tableDataLoading}
      />
      <Graph
        data={graphData?.dashboardGraphData}
        isLoading={graphDataLoading}
        planStatus={status}
      />
      <Table
        columns=" grid-cols-4 md:grid-cols-5 lg:grid-cols-8"
        title="Your holding"
        headings={headings}
        data={tableData?.tableData}
        isLoading={tableDataLoading}
        setIsOpen={setPortfolioCreate}
        planStatus={status}
        logo={tableData?.stockLogo}
        symbol={tableData?.stockSymbol}
      />
      {/* <Hello /> */}
      <TakeATourPopup isOpen={isTakeATourOpen} setIsOpen={setIsTakeATourOpen} />
      <WelcomePopupSubscribed isOpen={isOpenSub} setIsOpen={setIsOpenSub}  setIsTakeATourOpen={setIsTakeATourOpen} />
      <FreeConsultationPopup setIsOpen={setShowConsultation} isOpen={showConsultation} />
      <WelcomePopup isOpen={isOpen} setIsOpen={setIsOpen} setShowConsultation={setShowConsultation} />
      <CreateNewPortfolio isOpen={portfolioCreate} setIsOpen={setPortfolioCreate} />
    </main>
  );
};

export default UserDashboard;
