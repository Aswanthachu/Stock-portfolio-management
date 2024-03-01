import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthorizedLayout, AuthLayout } from "@/components";
import {
  UserDashboard,
  AccountSettings,
  Portfolio,
  ReferAndEarn,
  Subscription,
  Tickets,
  Tutorials,
  Checkout,
  UpiPayment,
  UpiUpdateStatus,
  StockDetails,
  AiChatAssistant,
} from "@/pages/user";
import {
  AddNewStock,
  AddNotification,
  AdminDashboard,
  AdminDashboardSingleUser,
  AdminDashboardUsers,
  AdminTicketView,
  AdminTicketsView,
  AdminTutorial,
  AiAssistantOverview,
  Coupons,
  Feedbacks,
  UserPortfolioDetails,
  UserSelfCreatedPortfolios,
  VerifyUpi,
} from "@/pages/admin";
import { Auth, ForgotPassword, PageNotFound, VerifyOtp } from "@/pages/core";
import Plans from "./pages/user/Plans";
import SingleTicket from "./pages/user/SingleTicket";
import SingleTutorial from "./pages/user/SingleTutorial";
import CreateTutorial from "./pages/admin/CreateTutorial";
import AdminTicketsOverview from "./pages/admin/AdminTicketsOverview";
import AdminSingleTicketDetails from "./pages/admin/AdminSingleTicketDetails";
import ResetMailSendStatus from "./pages/core/ResetMailSendStatus";
import ResetPassword from "./pages/core/ResetPassword";
import AdminPushNotification from "./pages/admin/AdminPushNotification";
import PaymentStatus from "./pages/user/PaymentStatus";

const App = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  return (
    <>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Auth type="signup" />} />
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-mail-send-success"
              element={<ResetMailSendStatus />}
            />
            <Route path="/new-password/:token" element={<ResetPassword />} />
          </Route>
          {/* User Routes */}

          <Route element={<AuthorizedLayout />}>
            <Route
              path="/"
              element={
                !user ? (
                  <Navigate to={"/login"} />
                ) : user?.role === 1 ? (
                  <Navigate to="/admin/dashboard" />
                ) : user?.role > 1 ? (
                  <Navigate to="/sub-admin" />
                ) : (
                  <Navigate to={"/dashboard"} />
                )
              }
            />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/refer-and-earn" element={<ReferAndEarn />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/stocks/:stockSymbol" element={<StockDetails />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route
              path="/user/tickets/view/:ticketId"
              element={<SingleTicket />}
            />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorials/:tutorialId" element={<SingleTutorial />} />
            <Route path="/ai-assistant" element={<AiChatAssistant />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/upi" element={<UpiPayment />} />
          <Route path="/upi-update-status" element={<UpiUpdateStatus />} />
          <Route
            path="/user/payment-status/:status/:txnId"
            element={<PaymentStatus />}
          />
          {/* Admin Routes */}

          <Route element={<AuthorizedLayout />}>
            <Route path="/admin/tickets" element={<AdminTicketsOverview />} />
            <Route
              path="/admin/tickets/:ticketId"
              element={<AdminSingleTicketDetails />}
            />
            <Route path="/admin/user" element={<AdminDashboardUsers />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/coupons" element={<Coupons />} />
            <Route
              path="/admin/user/:id"
              element={<AdminDashboardSingleUser />}
            />
            <Route
              path="/admin/user/:id/subadmin-activities/:ticketId"
              element={<AdminSingleTicketDetails />}
            />
            <Route
              path="/admin/user/:id/:itype/:pid"
              element={<UserPortfolioDetails />}
            />
            <Route
              path="/admin/user/self-portfolio-details/:portfolioId"
              element={<UserSelfCreatedPortfolios />}
            />
            <Route path="/admin/stocks" element={<AddNewStock />} />
            <Route
              path="/admin/stocks/:stockSymbol"
              element={<StockDetails />}
            />
            <Route path="/admin/verify-payment" element={<VerifyUpi />} />
            <Route path="/admin/feedbacks" element={<Feedbacks />} />
            <Route path="/admin/tutorials" element={<AdminTutorial />} />
            <Route
              path="/admin/add-notifications"
              element={<AddNotification />}
            />
            <Route path="/admin/create-tutorial" element={<CreateTutorial />} />
            <Route
              path="/admin/push-notification"
              element={<AdminPushNotification />}
            />
            <Route
              path="/admin/assistant-overview"
              element={<AiAssistantOverview/>}
            />
          </Route>

          {/* Sub-admin Routes */}

          <Route element={<AuthorizedLayout />}>
            <Route
              path="/sub-admin"
              element={
                user?.role === 2 || user?.role === 3 ? (
                  <Navigate to={"/sub-admin/tickets"} />
                ) : (
                  <Navigate to={"/sub-admin/users"} />
                )
              }
            />
            <Route path="/sub-admin/tickets" element={<AdminTicketsView />} />
            <Route path="/sub-admin/settings" element={<AccountSettings />} />
            <Route
              path="/sub-admin/tickets/view/*"
              element={<AdminTicketView />}
            />
            <Route path="/sub-admin/user" element={<AdminDashboardUsers />} />
            <Route
              path="/sub-admin/user/:id"
              element={<AdminDashboardSingleUser />}
            />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
