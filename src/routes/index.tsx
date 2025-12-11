import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";

const Apartments = lazy(() => import("@/pages/Home"));
const Residents = lazy(() => import("@/pages/About"));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "apartments", element: <Apartments /> },
      { path: "residents", element: <Residents /> },
    ],
  },
]);
