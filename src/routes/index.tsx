import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";

const Assets = lazy(() => import("@/pages/Assets/view-assets"));
const Apartments = lazy(() => import("@/pages/Feedback"));
const Services = lazy(() => import("@/pages/Services"));
const Report = lazy(() => import("@/pages/Report"));
const DetailServicePage = lazy(() => import("@/pages/Services/DetailService"));
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "assets", element: <Assets /> },
      { path: "residents", element: <Apartments /> },
      { path: "services", element: <Services /> },
      { path: "reports", element: <Report /> },
      { path: "services/:id", element: <DetailServicePage /> },
    ],
  },
]);
