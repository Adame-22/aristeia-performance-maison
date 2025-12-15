import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const candidatureSchema = z.object({
  prenom: z.string().min(2, "Prénom requis (min. 2 caractères)").max(50),
  nom: z.string().min(2, "Nom requis (min. 2 caractères)").max(50),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone requis").max(20),
  age: z.string().min(1, "Âge requis"),
  programme: z.string().min(1, "Veuillez sélectionner un programme"),
  experience: z.string().min(1, "Veuillez sélectionner votre niveau d'expérience"),
  objectifs: z.string().min(20, "Décrivez vos objectifs (min. 20 caractères)").max(1000),
  parcours: z.string().min(20, "Décrivez votre parcours sportif (min. 20 caractères)").max(1000),
  disponibilites: z.string().min(10, "Indiquez vos disponibilités").max(500),
  motivation: z.string().min(30, "Expliquez votre motivation (min. 30 caractères)").max(1500),
});

type CandidatureFormData = z.infer<typeof candidatureSchema>;

const Candidature = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programmeFromUrl = searchParams.get("programme") || "";

  const form = useForm<CandidatureFormData>({
    resolver: zodResolver(candidatureSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      age: "",
      programme: programmeFromUrl,
      experience: "",
      objectifs: "",
      parcours: "",
      disponibilites: "",
      motivation: "",
    },
  });

  useEffect(() => {
    if (programmeFromUrl) {
      form.setValue("programme", programmeFromUrl);
    }
  }, [programmeFromUrl, form]);

  const onSubmit = async (data: CandidatureFormData) => {
    setIsSubmitting(true);

    try {
      // Insert candidature and get the created record ID
      const { data: insertedData, error } = await supabase
        .from('candidatures')
        .insert({
          prenom: data.prenom,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          age: data.age,
          programme: data.programme,
          experience: data.experience,
          objectifs: data.objectifs,
          parcours: data.parcours,
          disponibilites: data.disponibilites,
          motivation: data.motivation,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Send email notifications with candidature ID (not raw data)
      try {
        await supabase.functions.invoke('send-candidature-notification', {
          body: { candidature_id: insertedData.id },
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Candidature envoyée !",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-card border border-border rounded-lg p-12">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="font-display text-3xl md:text-4xl mb-4">
                  Candidature envoyée !
                </h1>
                <p className="text-foreground/80 mb-8">
                  Merci pour votre intérêt envers Aristeia. Nous analyserons votre profil
                  et reviendrons vers vous dans les plus brefs délais.
                </p>
                <Button asChild>
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Programmes", href: "/programmes" },
                { label: "Candidature" },
              ]}
            />

            <h1 className="font-display text-4xl md:text-5xl text-center mb-4 tracking-tight">
              CANDIDATURE <span className="text-primary">ARISTEIA</span>
            </h1>

            <p className="text-lg text-foreground/80 text-center mb-12 max-w-2xl mx-auto">
              Rejoignez la Méthode Aristeia. Remplissez ce formulaire pour que nous puissions
              évaluer votre profil et vous orienter vers le programme adapté.
            </p>

            <div className="bg-card border border-border rounded-lg p-8 md:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Informations personnelles */}
                  <div>
                    <h2 className="font-display text-xl mb-4 text-primary">
                      Informations personnelles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+41 XX XXX XX XX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Âge</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Programme souhaité */}
                  <div>
                    <h2 className="font-display text-xl mb-4 text-primary">
                      Programme souhaité
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="programme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Programme visé</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un programme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="base">BASE - Fondations & Santé</SelectItem>
                                <SelectItem value="build">BUILD - Force & Hypertrophie</SelectItem>
                                <SelectItem value="peak">PEAK - Performance & Compétition</SelectItem>
                                <SelectItem value="indecis">Je ne sais pas encore</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niveau d'expérience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Votre niveau" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="debutant">Débutant (moins d'1 an)</SelectItem>
                                <SelectItem value="intermediaire">Intermédiaire (1-3 ans)</SelectItem>
                                <SelectItem value="avance">Avancé (3-5 ans)</SelectItem>
                                <SelectItem value="expert">Expert (5+ ans)</SelectItem>
                                <SelectItem value="competiteur">Compétiteur actif</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Objectifs et parcours */}
                  <div>
                    <h2 className="font-display text-xl mb-4 text-primary">
                      Objectifs & Parcours
                    </h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="objectifs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quels sont vos objectifs ?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez vos objectifs à court et long terme (force, compétition, santé, esthétique...)"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parcours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre parcours sportif</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre expérience en musculation/powerlifting, vos PR actuels, blessures éventuelles..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Disponibilités */}
                  <div>
                    <h2 className="font-display text-xl mb-4 text-primary">
                      Disponibilités
                    </h2>
                    <FormField
                      control={form.control}
                      name="disponibilites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vos disponibilités pour vous entraîner</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: 4x par semaine, matin et soir disponibles, week-ends libres..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Motivation */}
                  <div>
                    <h2 className="font-display text-xl mb-4 text-primary">
                      Motivation
                    </h2>
                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pourquoi Aristeia ?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Expliquez pourquoi vous souhaitez rejoindre Aristeia et ce qui vous motive dans votre démarche..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Envoyer ma candidature"
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Vos données sont traitées de manière confidentielle.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Candidature;
