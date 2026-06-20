import { Navigate, Route, Routes } from "react-router-dom"

import { HomePage } from "@/pages/HomePage"
import { CreateDashboardPage } from "@/pages/CreateDashboardPage"
import { MonitorDashboardPage } from "@/pages/MonitorDashboardPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/create" element={<CreateDashboardPage />} />
      <Route path="/dashboard/monitor" element={<MonitorDashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/monitor" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}