import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTPSignup from "./pages/OTPSignup";
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/MemberDashboard";
import GymProfile from "./pages/GymProfile";
import MyGyms from "./pages/MyGyms";
import MembershipManagement from "./pages/MembershipManagement";
import MemberRequests from "./pages/MemberRequests";
import Attendance from "./pages/Attendance";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import AddMember from "./pages/AddMember";
import Members from "./pages/Members";
import DashboardLayout from "./components/DashboardLayout";
import MemberLayout from "./components/MemberLayout";
import NotFound from "./pages/NotFound";
import TrainersPage from "./pages/trainers";
import AddTrainerPage from "./pages/trainers/new";
import EditTrainerPage from "./pages/trainers/[id]/edit";
import TrainerDetailsPage from "./pages/trainers/[id]";
import ExpensesPage from "./pages/expenses";
import AddExpensePage from "./pages/expenses/new";
import EditExpensePage from "./pages/expenses/[id]/edit";
import ExpenseDetailsPage from "./pages/expenses/[id]";

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
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-signup" element={<OTPSignup />} />
            
            {/* Gym Owner Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute userType="OWNER">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="gym-profile" element={<GymProfile />} />
              <Route path="members" element={<Members />} />
              <Route path="members/add" element={<AddMember />} />
              <Route path="add-member" element={<AddMember />} />
              <Route path="member-requests" element={<MemberRequests />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
            
            {/* Trainer Management Routes */}
            <Route path="trainers">
              <Route index element={
                <ProtectedRoute userType="OWNER">
                  <TrainersPage />
                </ProtectedRoute>
              } />
              <Route path="new" element={
                <ProtectedRoute userType="OWNER">
                  <AddTrainerPage />
                </ProtectedRoute>
              } />
              <Route path=":id" element={
                <ProtectedRoute userType="OWNER">
                  <TrainerDetailsPage />
                </ProtectedRoute>
              } />
              <Route path=":id/edit" element={
                <ProtectedRoute userType="OWNER">
                  <EditTrainerPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Expense Management Routes */}
            <Route path="expenses">
              <Route index element={
                <ProtectedRoute userType="OWNER">
                  <ExpensesPage />
                </ProtectedRoute>
              } />
              <Route path="new" element={
                <ProtectedRoute userType="OWNER">
                  <AddExpensePage />
                </ProtectedRoute>
              } />
              <Route path=":id" element={
                <ProtectedRoute userType="OWNER">
                  <ExpenseDetailsPage />
                </ProtectedRoute>
              } />
              <Route path=":id/edit" element={
                <ProtectedRoute userType="OWNER">
                  <EditExpensePage />
                </ProtectedRoute>
              } />
            </Route>
            </Route>
            
            {/* Member Protected routes */}
            <Route path="/member-dashboard" element={
              <ProtectedRoute userType="MEMBER">
                <MemberLayout />
              </ProtectedRoute>
            }>
              <Route index element={<MemberDashboard />} />
              <Route path="my-gyms" element={<MyGyms />} />
              <Route path="trainers" element={<TrainersPage />} />
              <Route path="trainers/new" element={<AddTrainerPage />} />
              <Route path="trainers/:id" element={<TrainerDetailsPage />} />
              <Route path="trainers/:id/edit" element={<EditTrainerPage />} />
              <Route path="membership" element={<MembershipManagement />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="profile" element={<Settings />} />

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
