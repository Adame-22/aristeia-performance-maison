import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Check, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Abonnement = () => {
  const { toast } = useToast();

  const handleSubscribe = () => {
    // TODO: connect to Stripe later for real payment processing
    toast({
      title: "Fonctionnalité bientôt disponible",
      description: "L'abonnement en ligne sera actif prochainement.",
    });
  };

  const offers = [
    {
      id: "acces",
      name: "Accès Salle",
      price: "49€",
      period: "/mois",
      description: "Pour ceux qui veulent juste s'entraîner",
      benefits: [
        "Accès illimité à la salle",
        "Tous les équipements",
        "Horaires étendus",
        "Vestiaires & douches",
      ],
    },
    {
      id: "base",
      name: "AAA Base",
      price: "79€",
      period: "/mois",
      description: "Coaching en groupe pour progresser ensemble",
      benefits: [
        "Tout de Accès Salle",
        "Coaching en groupe (2x/semaine)",
        "Programmes personnalisés",
        "Accès événements communauté",
      ],
    },
    {
      id: "build",
      name: "AAA Build",
      price: "119€",
      period: "/mois",
      description: "Suivi individuel pour atteindre tes objectifs",
      benefits: [
        "Tout de AAA Base",
        "Coaching individuel (1x/semaine)",
        "Bilan postural & mobilité",
        "Priorité événements & stages",
      ],
      featured: true,
    },
    {
      id: "peak",
      name: "AAA Peak",
      price: "179€",
      period: "/mois",
      description: "L'excellence : coaching + santé intégrée",
      benefits: [
        "Tout de AAA Build",
        "Kinésithérapie (1 séance/mois)",
        "Ostéopathie (1 séance/mois)",
        "Suivi nutrition personnalisé",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Abonnement" }]} />

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-6xl mb-4">
              Choisis ton niveau d'engagement
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tous nos membres ont accès aux séances illimitées. Choisis le niveau de coaching et de suivi santé qui correspond à tes objectifs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className={`border-border relative ${
                  offer.featured
                    ? "border-primary shadow-lg shadow-primary/20"
                    : ""
                }`}
              >
                {offer.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Populaire
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{offer.name}</CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{offer.price}</span>
                    <span className="text-muted-foreground">{offer.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {offer.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={offer.featured ? "default" : "outline"}
                    className="w-full group"
                    onClick={handleSubscribe}
                  >
                    <Lock className="mr-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    S'abonner (désactivé)
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Fonctionnalité bientôt disponible
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              {/* TODO: connect to Stripe later for real payment processing */}
              L'intégration des paiements sera active prochainement
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Abonnement;
