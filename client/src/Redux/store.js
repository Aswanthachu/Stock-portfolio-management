import { configureStore } from "@reduxjs/toolkit";

import coreReducer from "./Features/core";
import userReducer from "./Features/user";
import ticketReducer from "./Features/ticket";
import dashboardReducer from "./Features/dashboard";
import adminReducer from './Features/admin'
import portfolioReducer from "./Features/portfolio";
import notificationReducer from "./Features/notification";
import chatAssistantReducer from "./Features/chatAssistant";

export const store = configureStore({
  reducer: {
    core: coreReducer,
    user: userReducer,
    ticket: ticketReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    portfolio:portfolioReducer,
    notification:notificationReducer,
    chatAssistant:chatAssistantReducer
  },
});
