import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AcceleratorLayout } from "@/components/accelerator/AcceleratorLayout";
import AcceleratorDashboard from "@/pages/accelerator/Dashboard";
import Cohorts from "@/pages/accelerator/Cohorts";
import StartupProfile from "@/pages/accelerator/StartupProfile";
import Templates from "@/pages/accelerator/Templates";
import Settings from "@/pages/accelerator/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/accelerator/dashboard" replace />} />
            <Route path="/accelerator" element={<AcceleratorLayout />}>
              <Route path="dashboard" element={<AcceleratorDashboard />} />
              <Route path="cohorts" element={<Cohorts />} />
              <Route path="cohorts/:cohortId/:startupId" element={<StartupProfile />} />
              <Route path="templates" element={<Templates />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
