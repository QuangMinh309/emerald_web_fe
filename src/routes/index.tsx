import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";

const Assets = lazy(() => import("@/pages/Assets"));
const Apartments = lazy(() => import("@/pages/Feedback"));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "assets", element: <Assets /> },
      { path: "residents", element: <Apartments /> },
    ],
  },
]);
