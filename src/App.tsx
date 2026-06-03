/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import AdminLayout from "./layouts/AdminLayout"
import Login from "./pages/Login"
import TwoFactor from "./pages/TwoFactor"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import UserDetail from "./pages/UserDetail"
import Transactions from "./pages/Transactions"
import Disputes from "./pages/Disputes"
import DisputeDetail from "./pages/DisputeDetail"
import GiftcardsQueue from "./pages/GiftcardsQueue"
import GiftcardsInventory from "./pages/GiftcardsInventory"
import CryptoOps from "./pages/CryptoOps"
import Treasury from "./pages/Treasury"
import Compliance from "./pages/Compliance"

import Settings from "./pages/Settings"
import Reports from "./pages/Reports"
import AuditLog from "./pages/AuditLog"
import Staff from "./pages/Staff"

import CMS from "./pages/CMS"
import Marketing from "./pages/Marketing"
import HelpCenter from "./pages/HelpCenter"
import Notifications from "./pages/Notifications"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/2fa" element={<TwoFactor />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          
          <Route path="/admin/crypto-ops" element={<CryptoOps />} />
          <Route path="/admin/treasury" element={<Treasury />} />
          <Route path="/admin/compliance/*" element={<Compliance />} />

          <Route path="/admin/disputes" element={<Disputes />} />
          <Route path="/admin/disputes/:id" element={<DisputeDetail />} />
          <Route path="/admin/giftcards" element={<GiftcardsQueue />} />
          <Route path="/admin/giftcards/:id" element={<GiftcardsQueue />} />
          <Route path="/admin/giftcards/inventory" element={<GiftcardsInventory />} />

          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings/*" element={<Settings />} />
          <Route path="/admin/audit-log" element={<AuditLog />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/admin/marketing/*" element={<Marketing />} />
          <Route path="/admin/cms/*" element={<CMS />} />
          <Route path="/admin/help-center" element={<HelpCenter />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          
          {/* Placeholder for future routes */}
          <Route path="/admin/*" element={<div className="flex h-[calc(100vh-6rem)] items-center justify-center p-4 text-stone text-xs flex-col"><div className="text-4xl mb-4 opacity-20">🚧</div>Module under construction...</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

