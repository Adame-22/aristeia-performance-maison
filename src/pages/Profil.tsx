import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const STORAGE_KEY = "aph_user_profile";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(50),
  lastName: z.string().trim().min(1, "Le nom est requis").max(50),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(20).optional(),
  fitnessGoals: z.string().max(500).optional(),
  preferences: z.object({
    newsletter: z.boolean(),
    eventNotifications: z.boolean(),
    trainingReminders: z.boolean(),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profil = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    localStorage.getItem(`${STORAGE_KEY}_avatar`) || ""
  );

  // Load saved profile data
  const savedProfile = localStorage.getItem(STORAGE_KEY);
  const defaultValues: ProfileFormData = savedProfile
    ? JSON.parse(savedProfile)
    : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        fitnessGoals: "",
        preferences: {
          newsletter: true,
          eventNotifications: true,
          trainingReminders: false,
        },
      };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = (data: ProfileFormData) => {
    // TODO: connect to Supabase later to update user profile
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    toast({
      title: "Profil mis à jour",
      description: "Tes informations ont été enregistrées avec succès.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: upload to Supabase Storage later
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem(`${STORAGE_KEY}_avatar`, result);
        toast({
          title: "Photo mise à jour",
          description: "Ta photo de profil a été changée.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = `${form.watch("firstName")?.[0] || ""}${form.watch("lastName")?.[0] || ""}`.toUpperCase() || "M";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Mon Compte", href: "/compte" },
                { label: "Mon Profil" },
              ]}
            />

            <div className="mb-8">
              <h1 className="font-display text-4xl md:text-5xl mb-2">
                Mon Profil
              </h1>
              <p className="text-muted-foreground">
                Gère tes informations personnelles et tes préférences
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
              {/* Avatar Section */}
              <Card className="border-border h-fit">
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={avatarUrl} alt="Photo de profil" />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Camera className="h-5 w-5 text-primary-foreground" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Clique sur l'icône pour changer ta photo
                  </p>
                </CardContent>
              </Card>

              {/* Form Section */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>
                        Tes coordonnées et informations de contact
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Jean" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="jean.dupont@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone (optionnel)</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+33 6 12 34 56 78"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle>Objectifs fitness</CardTitle>
                      <CardDescription>
                        Partage tes objectifs pour un suivi personnalisé
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="fitnessGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mes objectifs</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Améliorer mon squat de 20kg, participer à un mock meet, développer ma masse musculaire..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle>Préférences</CardTitle>
                      <CardDescription>
                        Gère tes notifications et communications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="preferences.newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Newsletter Aristeia</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Reçois nos actualités, conseils et événements
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferences.eventNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Notifications d'événements</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Alertes pour les mock meets, stages et soirées
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferences.trainingReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Rappels d'entraînement</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Reçois des rappels pour rester régulier
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              {/* TODO: connect to Supabase later for real profile management */}
              Les modifications sont stockées localement pour le moment
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profil;
