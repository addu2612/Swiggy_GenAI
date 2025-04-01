import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import RecordFeedback from "./pages/user/RecordFeedback";
import AIFeedbackSummary from "./pages/user/AIFeedbackSummary";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import FeedbackRequests from "./pages/admin/FeedbackRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* User Routes - Protected */}
              <Route 
                path="/user/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/record-feedback" 
                element={
                  <ProtectedRoute>
                    <RecordFeedback />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/ai-feedback-summary" 
                element={
                  <ProtectedRoute>
                    <AIFeedbackSummary />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes - Protected and requires admin role */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/feedback-requests" 
                element={
                  <ProtectedRoute requireAdmin>
                    <FeedbackRequests />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
