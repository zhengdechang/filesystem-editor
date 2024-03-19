/*
 * @Description:
 * @Author: Devin
 * @Date: 2024-03-19 10:06:32
 */
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.scss";
import "bulmaswatch/flatly/bulmaswatch.scss";

// Mount the React app
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element (#root) not found");
}

const root = createRoot(container);
root.render(<App />);
