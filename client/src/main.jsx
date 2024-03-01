import React from "react";
import ReactDOM from "react-dom/client.js";
import { Provider } from "react-redux";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import { ToastProvider } from "./components/ToastContext/ToastContext.jsx";
import App from "./App.jsx";
import "./index.css";
import { store } from "./Redux/store.js";

import "../env.mjs";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);
