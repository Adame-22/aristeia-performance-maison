import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Candidature {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: string;
  programme: string;
  experience: string;
  objectifs: string;
  parcours: string;
  disponibilites: string;
  motivation: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCandidatures = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCandidatures = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les candidatures",
      });
    } else {
      setCandidatures(data || []);
    }
    
    setLoading(false);
  };

  const updateCandidatureStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("candidatures")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return false;
    }

    toast({
      title: "Statut mis à jour",
      description: `La candidature a été marquée comme "${status}"`,
    });
    
    // Refresh the list
    await fetchCandidatures();
    return true;
  };

  const deleteCandidature = async (id: string) => {
    const { error } = await supabase
      .from("candidatures")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
      });
      return false;
    }

    toast({
      title: "Candidature supprimée",
      description: "La candidature a été supprimée avec succès",
    });
    
    // Refresh the list
    await fetchCandidatures();
    return true;
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  return {
    candidatures,
    loading,
    error,
    refetch: fetchCandidatures,
    updateStatus: updateCandidatureStatus,
    deleteCandidature,
  };
};
