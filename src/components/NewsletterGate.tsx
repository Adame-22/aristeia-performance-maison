import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { z } from "zod";

interface NewsletterGateProps {
  category: "mock_meet" | "stages" | "communaute";
  formAction: string;
  signupHref: string;
}

const emailSchema = z.string()
  .trim()
  .email({ message: "Adresse email invalide" })
  .max(255, { message: "Email trop long (maximum 255 caractères)" });

const NewsletterGate = ({ category, formAction, signupHref }: NewsletterGateProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `aph_news_optin_${category}`;

  useEffect(() => {
    // Check if user already subscribed
    const subscribed = localStorage.getItem(storageKey) === "true";
    setIsSubscribed(subscribed);
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email with zod
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual newsletter service)
    try {
      // In production, send to formAction endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store subscription status
      localStorage.setItem(storageKey, "true");
      setIsSubscribed(true);
    } catch (err) {
      setError("Une erreur est survenue. Réessaie plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-2xl md:text-3xl mb-4">
          Merci pour ton inscription !
        </h3>
        <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
          Tu recevras toutes les informations sur nos événements en priorité. Tu peux maintenant réserver ta place.
        </p>
        <a
          href={signupHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button 
            size="lg"
            className="bg-primary hover:bg-[#1658C7] text-white font-semibold px-8 py-6 text-lg"
          >
            Réserver ma place →
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 md:p-12">
      <div className="flex justify-center mb-6">
        <Mail className="w-16 h-16 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-2xl md:text-3xl text-center mb-4">
        Reçois les infos en priorité
      </h3>
      <p className="text-foreground/80 text-center mb-8 leading-relaxed">
        Inscris-toi à notre newsletter pour être informé en avant-première des prochaines dates et réserver ta place.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div>
          <Input
            type="email"
            placeholder="ton.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className="w-full h-12 text-base"
            disabled={isSubmitting}
          />
          {error && (
            <p className="text-destructive text-sm mt-2">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-[#1658C7] text-white font-semibold h-12"
        >
          {isSubmitting ? "Inscription..." : "S'abonner aux actus"}
        </Button>

        <p className="text-sm text-foreground/60 text-center leading-relaxed">
          En soumettant, tu acceptes de recevoir les informations Aristeia. Tes données ne sont pas revendues. Tu peux te désabonner à tout moment.
        </p>

        <div className="text-center pt-2">
          <a
            href={signupHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-[#1658C7] underline"
          >
            Déjà abonné ? Réserver ma place
          </a>
        </div>
      </form>
    </div>
  );
};

export default NewsletterGate;
