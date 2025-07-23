import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/MemberDashboard";
import GymProfile from "./pages/GymProfile";
import MemberRequests from "./pages/MemberRequests";
import Attendance from "./pages/Attendance";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/DashboardLayout";
import MemberLayout from "./components/MemberLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Gym Owner Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute userType="owner">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="gym-profile" element={<GymProfile />} />
              <Route path="member-requests" element={<MemberRequests />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Member Protected routes */}
            <Route path="/member-dashboard" element={
              <ProtectedRoute userType="member">
                <MemberLayout />
              </ProtectedRoute>
            }>
              <Route index element={<MemberDashboard />} />
            </Route>
            
            {/* Redirect root based on user type or to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
