/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VisibilityProvider } from "./context/ModuleVisibilityContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SkeletonLoader from "./components/shared/SkeletonLoader";

// Pages
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
const UserPermissions = lazy(() => import("./pages/UserPermissions"));
const AiCopilot = lazy(() => import("./pages/AiCopilot"));
const LawSummarizer = lazy(() => import("./pages/LawSummarizer"));
const LawCalendar = lazy(() => import("./pages/LawCalendar"));
const CompanyRegulations = lazy(() => import("./pages/CompanyRegulations"));
const DevPermit = lazy(() => import("./pages/DevPermit"));
const SystemConfig = lazy(() => import("./pages/SystemConfig"));
const SystemLogs = lazy(() => import("./pages/SystemLogs"));
const VendorPO = lazy(() => import("./pages/VendorPO"));
const BranchSO = lazy(() => import("./pages/BranchSO"));
const RouteOptimization = lazy(() => import("./pages/RouteOptimization"));
const PromotionAllocation = lazy(() => import("./pages/PromotionAllocation"));
const ElectronicPOD = lazy(() => import("./pages/ElectronicPOD"));
const MarginProfit = lazy(() => import("./pages/MarginProfit"));
const VehicleMaster = lazy(() => import("./pages/VehicleMaster"));
const HandlingServiceFees = lazy(() => import("./pages/HandlingFees"));
const SLAContracts = lazy(() => import("./pages/SLAContracts"));
const StockDashboard = lazy(() => import("./pages/StockDashboard"));
const CycleCount = lazy(() => import("./pages/CycleCount"));
const ZoneSlottingOpt = lazy(() => import("./pages/ZoneSlotting"));
const Replenishment = lazy(() => import("./pages/Replenishment"));
const ClientInventory = lazy(() => import("./pages/ClientInventory"));
const StorageBilling = lazy(() => import("./pages/StorageBilling"));
const SmartPutaway = lazy(() => import("./pages/SmartPutaway"));
const DockScheduling = lazy(() => import("./pages/DockScheduling"));
const CrossDocking = lazy(() => import("./pages/CrossDocking"));
const WavePlanning = lazy(() => import("./pages/WavePlanning"));
const OrderPicking = lazy(() => import("./pages/OrderPicking"));
const ProductionDelivery = lazy(() => import("./pages/ProductionDelivery"));
const RawMaterials = lazy(() => import("./pages/RawMaterials"));
const RMGoodsReceipt = lazy(() => import("./pages/RMGoodsReceipt"));
const FGGoodsReceipt = lazy(() => import("./pages/FGGoodsReceipt"));
const RMOrderPicking = lazy(() => import("./pages/RMOrderPicking"));
const RMPackingSorting = lazy(() => import("./pages/RMPackingSorting"));
const FGPackingSorting = lazy(() => import("./pages/FGPackingSorting"));
const RMDispatchLoading = lazy(() => import("./pages/RMDispatchLoading"));
const SKUMaster = lazy(() => import("./pages/SKUMaster"));
const LocationMap = lazy(() => import("./pages/LocationMap"));
const RMPickingHistory = lazy(() => import("./pages/RMPickingHistory"));
const RMInflowReport = lazy(() => import("./pages/RMInflowReport"));
const FGInboundReport = lazy(() => import("./pages/FGInboundReport"));
const FGOutboundReport = lazy(() => import("./pages/FGOutboundReport"));
const DailyInventorySnapshot = lazy(() => import("./pages/DailyInventorySnapshot"));
const AccountsReceivable = lazy(() => import("./pages/AccountsReceivable"));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <VisibilityProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Suspense fallback={<SkeletonLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  {/* Protected Routes */}
                  <Route element={<Layout />}>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/law-calendar"
                      element={
                        <ProtectedRoute>
                          <LawCalendar />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/copilot"
                      element={
                        <ProtectedRoute>
                          <AiCopilot />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/law-summarizer"
                      element={
                        <ProtectedRoute>
                          <LawSummarizer />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company-regulations"
                      element={
                        <ProtectedRoute>
                          <CompanyRegulations />
                        </ProtectedRoute>
                      }
                    />

                    {/* General Modules (Read-only by default) */}
                    <Route
                      path="/employees"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Employees Directory" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recruitment"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Recruitment" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/attendance"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Attendance Core" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/leave"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Leave Requests" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payroll"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Payroll" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appraisals"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Appraisals" />
                        </ProtectedRoute>
                      }
                    />

                    {/* Core WMS / Inventory */}
                    <Route
                      path="/inventory/stock-dashboard"
                      element={
                        <ProtectedRoute>
                          <StockDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/cycle-count"
                      element={
                        <ProtectedRoute>
                          <CycleCount />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/zone-slotting"
                      element={
                        <ProtectedRoute>
                          <ZoneSlottingOpt />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/replenishment"
                      element={
                        <ProtectedRoute>
                          <Replenishment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/raw-materials"
                      element={
                        <ProtectedRoute>
                          <RawMaterials />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/smart-putaway"
                      element={
                        <ProtectedRoute>
                          <SmartPutaway />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/dock-scheduling"
                      element={
                        <ProtectedRoute>
                          <DockScheduling />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/production-delivery"
                      element={
                        <ProtectedRoute>
                          <ProductionDelivery />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/cross-docking"
                      element={
                        <ProtectedRoute>
                          <CrossDocking />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/outbound/wave-planning"
                      element={
                        <ProtectedRoute>
                          <WavePlanning />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/outbound/order-picking"
                      element={
                        <ProtectedRoute>
                          <OrderPicking />
                        </ProtectedRoute>
                      }
                    />

                    {/* Trading & Depository */}
                    <Route
                      path="/consignment/handling-fees"
                      element={
                        <ProtectedRoute>
                          <HandlingServiceFees />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consignment/sla-contracts"
                      element={
                        <ProtectedRoute>
                          <SLAContracts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consignment/client-inventory"
                      element={
                        <ProtectedRoute>
                          <ClientInventory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consignment/storage-billing"
                      element={
                        <ProtectedRoute>
                          <StorageBilling />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buy-sell/vendor-po"
                      element={
                        <ProtectedRoute>
                          <VendorPO />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buy-sell/branch-so"
                      element={
                        <ProtectedRoute>
                          <BranchSO />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buy-sell/promotion-allocation"
                      element={
                        <ProtectedRoute>
                          <PromotionAllocation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buy-sell/margin-profit"
                      element={
                        <ProtectedRoute>
                          <MarginProfit />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/transport/route-optimization"
                      element={
                        <ProtectedRoute>
                          <RouteOptimization />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/transport/electronic-pod"
                      element={
                        <ProtectedRoute>
                          <ElectronicPOD />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/transport/vehicle-master"
                      element={
                        <ProtectedRoute>
                          <VehicleMaster />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/master-data/sku-master"
                      element={
                        <ProtectedRoute>
                          <SKUMaster />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/master-data/location-map"
                      element={
                        <ProtectedRoute>
                          <LocationMap />
                        </ProtectedRoute>
                      }
                    />

                    {/* --- Newly Added WMS v1.0 Module Placeholders --- */}
                    <Route
                      path="/inbound/goods-receipt"
                      element={
                        <ProtectedRoute>
                          <FGGoodsReceipt />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/outbound/packing-sorting"
                      element={
                        <ProtectedRoute>
                          <FGPackingSorting />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/outbound/dispatch-loading"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Dispatch & Loading (ตรวจปล่อยขึ้นรถบรรทุกขนส่ง)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/fg-reservation-sync"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Auto Reservation Sync (ล็อกสต๊อกจองขายเรียลไทม์)" />
                        </ProtectedRoute>
                      }
                    />

                    {/* FG Warehouse Reports */}
                    <Route
                      path="/reports/fg-inbound"
                      element={
                        <ProtectedRoute>
                          <FGInboundReport />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/fg-outbound"
                      element={
                        <ProtectedRoute>
                          <FGOutboundReport />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/fg-stock"
                      element={
                        <ProtectedRoute>
                          <DailyInventorySnapshot />
                        </ProtectedRoute>
                      }
                    />

                    {/* RM Incoming QC */}
                    <Route
                      path="/inventory/raw-materials-qc"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="INCOMING INSPECTION (การวัดค่าผลสุ่มตรวจรับ RM)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/raw-materials-alerts"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="ระบบแจ้งเตือนปัญหาคุณภาพวัตถุดิบและอะไหล่ชำรุด" />
                        </ProtectedRoute>
                      }
                    />

                    {/* RM Inbounds */}
                    <Route
                      path="/inbound/rm-goods-receipt"
                      element={
                        <ProtectedRoute>
                          <RMGoodsReceipt />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/rm-dock-scheduling"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="DOCK SCHEDULING (เข้าท่ารถส่งวัตถุดิบและบรรจุภัณฑ์)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/rm-smart-putaway"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="SMART PUTAWAY RM (คำนวณตำแหน่งชั้นเก็บตู้วัสดุ)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbound/rm-reservation"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="Auto Reservation Sync RM (คิวจองเบิกล็อกวัตถุดิบ)" />
                        </ProtectedRoute>
                      }
                    />

                    {/* RM Outbounds */}
                    <Route
                      path="/outbound/rm-wave-planning"
                      element={
                        <ProtectedRoute>
                          <WavePlanning />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/outbound/rm-order-picking"
                      element={
                        <ProtectedRoute>
                          <RMOrderPicking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/outbound/rm-packing-sorting"
                      element={
                        <ProtectedRoute>
                          <RMPackingSorting />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/outbound/rm-dispatch-loading"
                      element={
                        <ProtectedRoute>
                          <RMDispatchLoading />
                        </ProtectedRoute>
                      }
                    />

                    {/* RM Inventory & Spares */}
                    <Route
                      path="/inventory/rm-cycle-count"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="CYCLE COUNT RM (รายการนับหมุนสต๊อกวัตถุดิบและอะไหล่)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/rm-zone-slotting"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="ZONE & SLOTTING RM (ผังชั้นวางสารเคมีอันตราย/อะไหล่)" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory/rm-replenishment"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="REPLENISHMENT RM (การดึงข้อมูลเติมสต๊อกวัสดุขั้นต่ำ)" />
                        </ProtectedRoute>
                      }
                    />

                    {/* RM Warehouse Reports */}
                    <Route
                      path="/reports/rm-inbound"
                      element={
                        <ProtectedRoute>
                          <RMInflowReport />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/rm-outbound"
                      element={
                        <ProtectedRoute>
                          <RMPickingHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/rm-stock"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="รายงานจุดแจ้งเตือนระดับวิกฤตของวัสดุและอะไหล่" />
                        </ProtectedRoute>
                      }
                    />

                    {/* Accounts Integration Bridge */}
                    <Route
                      path="/accounts/ar-invoice"
                      element={
                        <ProtectedRoute>
                          <AccountsReceivable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/accounts/ap-ledger"
                      element={
                        <ProtectedRoute>
                          <PlaceholderPage title="บัญชีตั้งหนี้เจ้าหนี้การค้าส่งมอบเก็บคลัง (AP Purchase Ledger)" />
                        </ProtectedRoute>
                      }
                    />

                    {/* Confidential Modules */}
                    <Route
                      path="/dev-permit"
                      element={
                        <ProtectedRoute>
                          <DevPermit />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dev-logs"
                      element={
                        <ProtectedRoute>
                          <SystemLogs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute isConfidential>
                          <SystemConfig />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/permissions"
                      element={
                        <ProtectedRoute isConfidential>
                          <UserPermissions />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all */}
                    <Route
                      path="*"
                      element={<PlaceholderPage title="Module Loading" />}
                    />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </NotificationProvider>
        </VisibilityProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
