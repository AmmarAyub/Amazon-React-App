import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import AmazonDashboard from "./components/dashboard/AmazonDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Products from "./pages/Product";
import Orders from "./pages/Orders ";
import UserList from "./pages/User";
import "bootstrap/dist/css/bootstrap.min.css";
import SalesDashboard from "./components/dashboard/SalesDashboard";
import CustomerLedger from "./pages/CustomerLedger";
import SQLBackup from "./pages/SQLBackup ";
import Partners from "./pages/Partners Management/Partners";
import PartnerCreate from "./pages/Partners Management/PartnerCreate";
import EditPartner from "./pages/Partners Management/EditPartner";

function App() {
  useEffect(() => {
    // Dynamically import Bootstrap JS (optional)
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Protected routes wrapped with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/amazon" element={<AmazonDashboard />} />
            <Route path="/dashboard/sales" element={<SalesDashboard />} />
            <Route path="/customerledger" element={<CustomerLedger />} />
            <Route path="/products" element={<Products />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partnerCreate" element={<PartnerCreate />} />
            {/* <Route path="/editPartner" element={<EditPartner />} /> */}
               <Route path="/editPartner/:partnerId" element={<EditPartner />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/sqlbackup" element={<SQLBackup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
