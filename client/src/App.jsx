import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import LoginLanding from "./pages/LoginLanding"
import Leaves from "./pages/Leaves"
import Layout from "./pages/Layout"
import PaySlip from "./pages/PaySlip"
import PrintPaySlip from "./pages/PrintPaySlip"
import Settings from "./pages/Settings"
import LoginForm from "./components/LoginForm"

const App = () => {
  return (
    <>
      <Toaster/>

      <Routes>

        <Route path="/login" element={<LoginLanding/>} />
        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization" />} />
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to manage the organization" />} />

        <Route element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/employees" element={<Employees/>} />
          <Route path="/attendance" element={<Attendance/>} />
          <Route path="/leave" element={<Leaves/>} />
          <Route path="/payslips" element={<PaySlip/>} />
          <Route path="/setting" element={<Settings/>} />
        </Route>

        <Route path="/print/payslips/:id" element={<PrintPaySlip/>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </>
  )
}

export default App
