import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Equipe from "./pages/Equipe";
import Sante from "./pages/Sante";
import Kinesitherapie from "./pages/Kinesitherapie";
import Osteopathie from "./pages/Osteopathie";
import Nutrition from "./pages/Nutrition";
import Programmes from "./pages/Programmes";
import Candidature from "./pages/Candidature";
import MockMeet from "./pages/MockMeet";
import Stages from "./pages/Stages";
import Communaute from "./pages/Communaute";
import Evenements from "./pages/Evenements";
import Contact from "./pages/Contact";
import Connexion from "./pages/Connexion";
import Compte from "./pages/Compte";
import Abonnement from "./pages/Abonnement";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/sante" element={<Sante />} />
            <Route path="/sante/kinesitherapie" element={<Kinesitherapie />} />
            <Route path="/sante/osteopathie" element={<Osteopathie />} />
            <Route path="/sante/nutrition" element={<Nutrition />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/candidature" element={<Candidature />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/evenements/mock-meet" element={<MockMeet />} />
            <Route path="/evenements/stages" element={<Stages />} />
            <Route path="/evenements/communaute" element={<Communaute />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
