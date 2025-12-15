import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const programs = [
  {
    name: "BASE",
    subtitle: "Fondations & Santé",
    price: "Sur candidature",
    description: "Santé du mouvement, maîtrise des patterns fondamentaux, mobilité. Pour construire un corps solide et durable.",
    features: [
      "Évaluation posturale complète",
      "Programme mobilité personnalisé",
      "Apprentissage des mouvements fondamentaux",
      "Suivi de progression mensuel",
      "Accès aux séances collectives",
    ],
    highlight: false,
  },
  {
    name: "BUILD",
    subtitle: "Force & Hypertrophie",
    price: "Sur candidature",
    description: "Développement de la force athlétique et de la masse musculaire. Travail technique, constance et cycles de progression.",
    features: [
      "Programme force athlétique individualisé",
      "Cycles de progression structurés",
      "Coaching technique avancé",
      "Plan nutritionnel personnalisé",
      "Suivi hebdomadaire avec coach",
      "Accès prioritaire aux événements",
    ],
    highlight: true,
  },
  {
    name: "PEAK",
    subtitle: "Performance & Compétition",
    price: "Sur candidature",
    description: "Optimisation maximale. Stratégie de compétition, gestion de la fatigue (taper) et peaking pour le jour J.",
    features: [
      "Programmation 100% individualisée",
      "Coaching 1-on-1 quotidien",
      "Stratégie de peaking compétition",
      "Gestion du taper et récupération",
      "Analyse vidéo et biomécanique",
      "Nutrition + supplémentation optimisée",
      "Accès VIP à tous les services",
    ],
    highlight: false,
  },
];

const Programmes = () => {
  const navigate = useNavigate();

  return (
    <section id="programmes" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... keep headers ... */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            LA MÉTHODE <span className="text-primary">ARISTEIA</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80">
            Une architecture de performance en 3 phases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`bg-card rounded-lg p-8 flex flex-col ${program.highlight
                ? "border-2 border-primary shadow-xl scale-105 lg:scale-110"
                : "border border-border"
                } hover:border-primary transition-all duration-300`}
            >
              {program.highlight && (
                <div className="bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4 w-fit">
                  Populaire
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-display text-4xl mb-2 tracking-wide">{program.name}</h3>
                <p className="text-primary font-semibold text-lg">{program.subtitle}</p>
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">{program.description}</p>
              <div className="mb-6">
                <p className="font-display text-xl text-muted-foreground">{program.price}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {program.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Button
                  variant="cta-primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/candidature?programme=${program.name.toLowerCase()}`)}
                >
                  Postuler
                </Button>
                <button
                  onClick={() => navigate("/programmes")}
                  className="block w-full text-center text-primary hover:text-blue-hover text-sm font-semibold pt-2 transition-colors"
                >
                  Détails de l'offre →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programmes;
