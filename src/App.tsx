import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AcceleratorLayout } from "@/components/accelerator/AcceleratorLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CheckEmail from "@/pages/CheckEmail";
import AuthCallback from "@/pages/AuthCallback";
import InviteAccept from "@/pages/InviteAccept";
import AcceleratorDashboard from "@/pages/accelerator/Dashboard";
import Cohorts from "@/pages/accelerator/Cohorts";
import StartupProfile from "@/pages/accelerator/StartupProfile";
import Templates from "@/pages/accelerator/Templates";
import Settings from "@/pages/accelerator/Settings";
import InviteUser from "@/pages/accelerator/InviteUser";
import ApplicationsHub from "@/pages/accelerator/applications/ApplicationsHub";
import FormsIndex from "@/pages/accelerator/applications/FormsIndex";
import FormBuilder from "@/pages/accelerator/applications/FormBuilder";
import FormResponses from "@/pages/accelerator/applications/FormResponses";
import Pipeline from "@/pages/accelerator/applications/Pipeline";
import ApplicationReview from "@/pages/accelerator/applications/ApplicationReview";
import PublicForm from "@/pages/PublicForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <AuthProvider>
      <WorkspaceProvider>
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/apply/:publishSlug" element={<PublicForm />} />
            <Route path="/invite/accept" element={<InviteAccept />} />
            <Route path="/accelerator" element={<ProtectedRoute><AcceleratorLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/accelerator/dashboard" replace />} />
              <Route path="dashboard" element={<AcceleratorDashboard />} />
              <Route path="cohorts" element={<Cohorts />} />
              <Route path="cohorts/:cohortId/:startupId" element={<StartupProfile />} />
              <Route path="applications" element={<ApplicationsHub />}>
                <Route index element={<FormsIndex />} />
                <Route path="forms" element={<FormsIndex />} />
                <Route path="forms/:formId/builder" element={<FormBuilder />} />
                <Route path="forms/:formId/responses" element={<FormResponses />} />
                <Route path="pipeline" element={<Pipeline />} />
                <Route path="application/:applicationId" element={<ApplicationReview />} />
              </Route>
              <Route path="templates" element={<Templates />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/invite" element={<InviteUser />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
      </WorkspaceProvider>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
