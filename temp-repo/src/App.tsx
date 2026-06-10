/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisibilityProvider } from './context/ModuleVisibilityContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AiCopilot from './pages/AiCopilot';
import LawSummarizer from './pages/LawSummarizer';
import LawCalendar from './pages/LawCalendar';
import DevPermit from './pages/DevPermit';
import SystemConfig from './pages/SystemConfig';
import SystemLogs from './pages/SystemLogs';

export default function App() {
  return (
    <AuthProvider>
      <VisibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/law-calendar" element={
                <ProtectedRoute>
                  <LawCalendar />
                </ProtectedRoute>
              } />
              <Route path="/copilot" element={
                <ProtectedRoute>
                  <AiCopilot />
                </ProtectedRoute>
              } />
              <Route path="/law-summarizer" element={
                <ProtectedRoute>
                  <LawSummarizer />
                </ProtectedRoute>
              } />
              
              {/* General Modules (Read-only by default) */}
              <Route path="/employees" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Employees Directory" />
                </ProtectedRoute>
              } />
              <Route path="/recruitment" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Recruitment" />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Attendance Core" />
                </ProtectedRoute>
              } />
              <Route path="/leave" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Leave Requests" />
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Payroll" />
                </ProtectedRoute>
              } />
              <Route path="/appraisals" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Appraisals" />
                </ProtectedRoute>
              } />

              {/* Confidential Modules */}
              <Route path="/dev-permit" element={
                <ProtectedRoute>
                  <DevPermit />
                </ProtectedRoute>
              } />
              <Route path="/dev-logs" element={
                <ProtectedRoute>
                  <SystemLogs />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute isConfidential>
                  <SystemConfig />
                </ProtectedRoute>
              } />
              <Route path="/permissions" element={
                <ProtectedRoute isConfidential>
                  <UserPermissions />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<PlaceholderPage title="Module Loading" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VisibilityProvider>
    </AuthProvider>
  );
}

