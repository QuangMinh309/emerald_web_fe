import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DetailAssetPage from "@/pages/Assets/detail-asset";
import ResidentsPage from "@/pages/Residents/view-residents";
import DetailResidentPage from "@/pages/Residents/detail-resident";
import BlocksPage from "@/pages/Blocks/view-blocks";
import CreateBlockPage from "@/pages/Blocks/create-block";
import UpdateBlockPage from "@/pages/Blocks/update-block";
import DetailNotificationPage from "@/pages/Notifications/detail-notification";
import DetailBlockPage from "@/pages/Blocks/detail-block";
import DetailApartmentPage from "@/pages/Apartments/detail-apartment";
import ApartmentsPage from "@/pages/Apartments/view-apartments";
import CreateVotingPage from "@/pages/Votings/create-voting";
import UpdateVotingPage from "@/pages/Votings/update-voting";
import DetailVotingPage from "@/pages/Votings/detail-voting";
import InvoicesPage from "@/pages/Invoices/view-invoices";
import DetailInvoicePage from "@/pages/Invoices/detail-invoice";
import TechniciansPage from "@/pages/Technicians/view-technicians";
import DetailTechnicianPage from "@/pages/Technicians/detail-technician";
import MaintenancesPage from "@/pages/Maintenances/view-maintenances";
import DetailMaintenancePage from "@/pages/Maintenances/detail-maintenance";
import IssuesPage from "@/pages/Issues/view-issues";
import DetailIssuePage from "@/pages/Issues/detail-issue";
import FeesPage from "@/pages/Fees/view-fees";
import DetailFeePage from "@/pages/Fees/detail-fee";
import AccountsPage from "@/pages/Accounts/view-accounts";
import DetailAccountPage from "@/pages/Accounts/detail-account";

const Assets = lazy(() => import("@/pages/Assets/view-assets"));
const Notifications = lazy(() => import("@/pages/Notifications/view-notifications"));
const SystemNotifications = lazy(() => import("@/pages/SystemNotifications"));
const Services = lazy(() => import("@/pages/Services"));
const Report = lazy(() => import("@/pages/Report"));
const DetailServicePage = lazy(() => import("@/pages/Services/DetailService"));
const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const VotingsPage = lazy(() => import("@/pages/Votings/view-votings"));
const ProfilePage = lazy(() => import("@/pages/Profile"));

export const routes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/blocks" replace /> },
      { path: "assets", element: <Assets /> },
      { path: "notifications", element: <Notifications /> },
      { path: "notifications/:id", element: <DetailNotificationPage /> },
      { path: "system-notifications", element: <SystemNotifications /> },
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
      { path: "apartments/:id", element: <DetailApartmentPage /> },
      { path: "apartments", element: <ApartmentsPage /> },
      { path: "votings", element: <VotingsPage /> },
      { path: "votings/create", element: <CreateVotingPage /> },
      { path: "votings/update/:id", element: <UpdateVotingPage /> },
      { path: "votings/:id", element: <DetailVotingPage /> },
      { path: "invoices", element: <InvoicesPage /> },
      { path: "invoices/:id", element: <DetailInvoicePage /> },
      { path: "technicians", element: <TechniciansPage /> },
      { path: "technicians/:id", element: <DetailTechnicianPage /> },
      { path: "maintenances", element: <MaintenancesPage /> },
      { path: "maintenances/:id", element: <DetailMaintenancePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "issues", element: <IssuesPage /> },
      { path: "issues/:id", element: <DetailIssuePage /> },
      { path: "fees", element: <FeesPage /> },
      { path: "fees/:id", element: <DetailFeePage /> },
      { path: "accounts", element: <AccountsPage /> },
      { path: "accounts/:accountId", element: <DetailAccountPage /> },
    ],
  },
]);
