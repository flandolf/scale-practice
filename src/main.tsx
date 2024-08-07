import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";
import ArpeggioSpeedChallenge from "@/components/arpeggio-speed-challenge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/arp",
    element: <ArpeggioSpeedChallenge />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
