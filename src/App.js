import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Products from "./pages/Product";
import Orders from "./pages/Orders ";
import UserList from "./pages/User";
import "bootstrap/dist/css/bootstrap.min.css";

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
            <Route path="./pages/Products" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<UserList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
