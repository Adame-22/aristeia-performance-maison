import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Le nom est requis" }).max(100, { message: "Le nom doit faire moins de 100 caractères" }),
  email: z.string().trim().email({ message: "Adresse email invalide" }).max(255, { message: "L'email doit faire moins de 255 caractères" }),
  phone: z.string().trim().min(1, { message: "Le téléphone est requis" }).max(20, { message: "Le téléphone doit faire moins de 20 caractères" }),
  message: z.string().trim().min(1, { message: "Le message est requis" }).max(1000, { message: "Le message doit faire moins de 1000 caractères" })
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Placeholder for form submission - replace with actual endpoint
      toast.success("Message envoyé avec succès!");
      reset();
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb 
            items={[
              { label: "Accueil", href: "/" },
              { label: "Contact" }
            ]} 
          />
          
          <div className="max-w-2xl mx-auto mt-8 mb-16">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight">
              NOUS <span className="text-primary">CONTACTER</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une question, un projet, une envie de t'entraîner chez Aristeia ? Contacte-nous.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-lg border border-border">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  placeholder="Jean Dupont"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jean@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+41 XX XXX XX XX"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Décris ton projet ou ta question..."
                  rows={6}
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="cta-primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Champs obligatoires. Tes données sont traitées de manière confidentielle.
              </p>
            </form>

            {/* Contact Info Block */}
            <div className="mt-12 bg-card border border-border rounded-lg p-6 md:p-8">
              <h2 className="font-display text-2xl mb-6 tracking-tight">
                INFORMATIONS DE <span className="text-primary">CONTACT</span>
              </h2>
              <div className="space-y-4 text-foreground/80">
                <div>
                  <p className="font-semibold text-foreground mb-1">Email</p>
                  <a href="mailto:contact@aristeia-performance.fr" className="hover:text-primary transition-colors">
                    contact@aristeia-performance.fr
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Téléphone</p>
                  <a href="tel:+41XXXXXXXX" className="hover:text-primary transition-colors">
                    +41 XX XXX XX XX
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Réseaux sociaux</p>
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                    <a href="#" className="hover:text-primary transition-colors">TikTok</a>
                    <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
