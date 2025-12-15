import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.loading) return;

    if (!authState.isLoggedIn) {
      navigate("/connexion");
      return;
    }

    if (requireAdmin && !authState.isAdmin) {
      navigate("/compte");
    }
  }, [authState, requireAdmin, navigate]);

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authState.isLoggedIn) {
    return null;
  }

  if (requireAdmin && !authState.isAdmin) {
    return null;
  }

  return <>{children}</>;
};
