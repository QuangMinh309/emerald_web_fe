import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";
import DetailAssetPage from "@/pages/Assets/detail-asset";
import ResidentsPage from "@/pages/Residents/view-residents";
import DetailResidentPage from "@/pages/Residents/detail-resident";
import BlocksPage from "@/pages/Blocks/view-blocks";
import CreateBlockPage from "@/pages/Blocks/create-block";
import UpdateBlockPage from "@/pages/Blocks/update-block";
import DetailNotificationPage from "@/pages/Notifications/detail-notification";
import DetailBlockPage from "@/pages/Blocks/detail-block";

const Assets = lazy(() => import("@/pages/Assets/view-assets"));
const Notifications = lazy(() => import("@/pages/Notifications/view-notifications"));
const Services = lazy(() => import("@/pages/Services"));
const Report = lazy(() => import("@/pages/Report"));
const DetailServicePage = lazy(() => import("@/pages/Services/DetailService"));
const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

export const routes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "assets", element: <Assets /> },
      { path: "notifications", element: <Notifications /> },
      { path: "notifications/:id", element: <DetailNotificationPage /> },
      { path: "assets/:id", element: <DetailAssetPage /> },
      { path: "residents", element: <ResidentsPage /> },
      { path: "residents/:id", element: <DetailResidentPage /> },
      { path: "services", element: <Services /> },
      { path: "services/:id", element: <DetailServicePage /> },
      { path: "reports", element: <Report /> },
      { path: "blocks", element: <BlocksPage /> },
      { path: "blocks/:id", element: <DetailBlockPage /> },
      { path: "blocks/create", element: <CreateBlockPage /> },
      { path: "blocks/update/:id", element: <UpdateBlockPage /> },
    ],
  },
]);
