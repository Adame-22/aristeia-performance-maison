import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { LogOut, Calendar, CheckCircle2, Clock, Shield } from "lucide-react";

const Compte = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/connexion");
  };

  const userName = authState.user?.user_metadata?.full_name || 
                   authState.user?.email?.split("@")[0] || 
                   "Membre Aristeia";

  // Mock event data
  const events = [
    { id: 1, name: "Mock Meet Février", date: "15/02/2025", status: "inscrit" },
    { id: 2, name: "Stage Bench Press", date: "22/02/2025", status: "disponible" },
    { id: 3, name: "Soirée Communauté", date: "01/03/2025", status: "disponible" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mon Compte" }]} />

            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display text-4xl md:text-5xl mb-2">
                  Bienvenue, {userName}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-primary">
                    Membre actif
                  </Badge>
                  {authState.isAdmin && (
                    <Badge variant="outline">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Mon abonnement</CardTitle>
                  <CardDescription>Statut et renouvellement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Formule</span>
                      <span className="font-semibold">AAA Build</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Statut</span>
                      <Badge variant="default">Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prochain renouvellement</span>
                      <span className="font-semibold">15/02/2026</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="/abonnement">Modifier mon abonnement</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Accès rapide</CardTitle>
                  <CardDescription>Raccourcis utiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/programmes">
                      <Calendar className="mr-2 h-4 w-4" />
                      Voir les programmes
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/profil">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mon Profil
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/evenements">
                      <Calendar className="mr-2 h-4 w-4" />
                      Événements à venir
                    </a>
                  </Button>
                  {authState.isAdmin && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Accès Admin
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Mes événements</CardTitle>
                <CardDescription>
                  Inscriptions et événements disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                      {event.status === "inscrit" ? (
                        <Badge variant="default" className="bg-primary">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Inscrit
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" />
                          Disponible
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Les inscriptions seront bientôt disponibles en ligne
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Compte;
