import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppProvider } from "./context/AppContext";
import App from "./App";
import "./styles/index.css";
import "./styles/global.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    
      <AppProvider>
        <App />
      </AppProvider>
  
  </React.StrictMode>
);
