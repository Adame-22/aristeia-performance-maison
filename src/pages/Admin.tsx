import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Eye, Trash2, FileText, Loader2, RefreshCw } from "lucide-react";
import { useCandidatures, Candidature } from "@/hooks/useCandidatures";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  reviewing: "En cours d'examen",
  accepted: "Acceptée",
  rejected: "Refusée",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  reviewing: "secondary",
  accepted: "default",
  rejected: "destructive",
};

const programmeLabels: Record<string, string> = {
  base: "BASE - Fondations & Santé",
  build: "BUILD - Force & Hypertrophie",
  peak: "PEAK - Performance & Compétition",
};

const experienceLabels: Record<string, string> = {
  debutant: "Débutant (< 1 an)",
  intermediaire: "Intermédiaire (1-3 ans)",
  avance: "Avancé (3-5 ans)",
  expert: "Expert (5+ ans)",
};

const CandidatureDetailDialog = ({ candidature }: { candidature: Candidature }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Candidature de {candidature.prenom} {candidature.nom}
          </DialogTitle>
          <DialogDescription>
            Soumise le {format(new Date(candidature.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{candidature.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{candidature.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Âge</p>
              <p className="font-medium">{candidature.age} ans</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Programme souhaité</p>
              <p className="font-medium">{programmeLabels[candidature.programme] || candidature.programme}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Niveau d'expérience</p>
              <p className="font-medium">{experienceLabels[candidature.experience] || candidature.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponibilités</p>
              <p className="font-medium">{candidature.disponibilites}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Objectifs</p>
            <p className="bg-muted p-3 rounded-md">{candidature.objectifs}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Parcours sportif</p>
            <p className="bg-muted p-3 rounded-md">{candidature.parcours}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Motivation</p>
            <p className="bg-muted p-3 rounded-md">{candidature.motivation}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Admin = () => {
  const { authState } = useAuth();
  const { candidatures, loading, refetch, updateStatus, deleteCandidature } = useCandidatures();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    await updateStatus(id, newStatus);
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCandidature(id);
  };

  const stats = {
    total: candidatures.length,
    pending: candidatures.filter(c => c.status === "pending").length,
    accepted: candidatures.filter(c => c.status === "accepted").length,
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Admin" }]} />

            <div className="mb-8">
              <h1 className="font-display text-4xl md:text-6xl mb-2">
                Administration
              </h1>
              <p className="text-muted-foreground">
                Gestion des candidatures au programme Aristeia
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Candidatures</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.accepted}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Candidatures</CardTitle>
                  <CardDescription>
                    Liste de toutes les candidatures reçues
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : candidatures.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune candidature pour le moment
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Programme</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidatures.map((candidature) => (
                        <TableRow key={candidature.id}>
                          <TableCell className="font-medium">
                            {candidature.prenom} {candidature.nom}
                          </TableCell>
                          <TableCell>{candidature.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {candidature.programme.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(candidature.created_at), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={candidature.status}
                              onValueChange={(value) => handleStatusChange(candidature.id, value)}
                              disabled={updatingId === candidature.id}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue>
                                  <Badge variant={statusColors[candidature.status]}>
                                    {statusLabels[candidature.status]}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="reviewing">En cours d'examen</SelectItem>
                                <SelectItem value="accepted">Acceptée</SelectItem>
                                <SelectItem value="rejected">Refusée</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <CandidatureDetailDialog candidature={candidature} />
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer la candidature ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. La candidature de {candidature.prenom} {candidature.nom} sera définitivement supprimée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(candidature.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
