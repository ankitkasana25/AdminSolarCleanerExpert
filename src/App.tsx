import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/Layout/DashboardLayout"
import Dashboard from "@/Pages/Dashboard"
import UsersPage from "@/Pages/Users"
import OrdersPage from "@/Pages/Orders"
import ServicesPage from "@/Pages/Services"
import Login from "@/Pages/Login"
import { authStore } from "@/Store/auth-store"
import { observer } from "mobx-react-lite"

const ProtectedRoute = observer(({ children }: { children: React.ReactNode }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <DashboardLayout>{children}</DashboardLayout>
})

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
