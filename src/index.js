import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("main-container"));

root.render(
  <HelmetProvider>
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </React.StrictMode>
  </HelmetProvider>
);
