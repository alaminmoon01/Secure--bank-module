import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLogin from "../modules/authentication/CustomerLogin";
import AdminLogin from "../modules/authentication/AdminLogin";
import CustomerRegistration from "../pages/CustomerRegistration";
import CustomerRoute from "./CustomerRoute";
import AdminGuard from "./AdminGuard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateCustomer from "../pages/admin/CreateCustomer";
import CustomerManagement from "../pages/admin/CustomerManagement";
import Deposit from "../pages/admin/Deposit";
import Withdraw from "../pages/admin/Withdraw";
import Transactions from "../pages/admin/Transactions";
import LoginRequests from "../pages/admin/LoginRequests";
import DeviceManagement from "../pages/admin/DeviceManagement";
import SecurityReports from "../pages/admin/SecurityReports";
import SuspiciousTransactions from "../pages/admin/SuspiciousTransactions";
import RiskBasedBlocking from "../pages/admin/RiskBasedBlocking";
import ActivityHistory from "../pages/admin/ActivityHistory";
import AccountManagement from "../pages/admin/AccountManagement";
import SupportRequests from "../pages/admin/SupportRequests";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import Help from "../pages/admin/Help";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<CustomerLogin />} />

      <Route
        path="/register"
        element={<CustomerRegistration />}
      />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/customer/dashboard"
        element={<CustomerRoute />}
      />

      <Route path="/admin" element={<AdminGuard />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="create-customer"
          element={<CreateCustomer />}
        />

        <Route
          path="customers"
          element={<CustomerManagement />}
        />

        <Route path="deposit" element={<Deposit />} />

        <Route path="withdraw" element={<Withdraw />} />

        <Route
          path="transactions"
          element={<Transactions />}
        />

        <Route
          path="login-requests"
          element={<LoginRequests />}
        />

        <Route
          path="devices"
          element={<DeviceManagement />}
        />

        <Route
          path="security-reports"
          element={<SecurityReports />}
        />

        <Route
          path="suspicious-transactions"
          element={<SuspiciousTransactions />}
        />

        <Route path="risk-based-blocking" element={<RiskBasedBlocking />} />

        <Route path="activity-history" element={<ActivityHistory />} />

        <Route
          path="accounts"
          element={<AccountManagement />}
        />

        <Route
          path="support"
          element={<SupportRequests />}
        />

        <Route path="reports" element={<Reports />} />

        <Route path="settings" element={<Settings />} />

        <Route path="help" element={<Help />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}
