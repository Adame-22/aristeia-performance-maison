import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Check } from "lucide-react";

const programmes = [
  {
    id: "base",
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
  },
  {
    id: "build",
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
  },
  {
    id: "peak",
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
  },
];

const Programmes = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Programmes" },
              ]}
            />
            
            <h1 className="font-display text-5xl md:text-6xl text-center mb-6 tracking-tight">
              LA MÉTHODE <span className="text-primary">ARISTEIA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 text-center mb-16 leading-relaxed max-w-3xl mx-auto">
              Une architecture de performance en 3 phases.
            </p>

            <div className="space-y-20">
              {programmes.map((program) => (
                <div
                  key={program.id}
                  id={program.id}
                  className="bg-card border border-border rounded-lg p-8 md:p-12 scroll-mt-32"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    <div className="flex-1">
                      <h2 className="font-display text-4xl md:text-5xl mb-3 tracking-wide">
                        {program.name}
                      </h2>
                      <p className="text-primary font-semibold text-xl mb-4">{program.subtitle}</p>
                      <p className="text-foreground/80 mb-6 leading-relaxed">{program.description}</p>
                      <p className="font-display text-xl text-muted-foreground mb-6">{program.price}</p>
                      <a
                        href={`/candidature?programme=${program.id}`}
                        className="inline-block px-6 py-3 bg-primary hover:bg-blue-hover text-white font-semibold rounded-md transition-colors"
                      >
                        Postuler
                      </a>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-4">Ce qui est inclus :</h3>
                      <ul className="space-y-3">
                        {program.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-foreground/80 mb-6">
                Prêt à commencer votre transformation ?
              </p>
              <a
                href="/candidature"
                className="inline-block px-8 py-4 bg-primary hover:bg-blue-hover text-white font-semibold rounded-md transition-colors"
              >
                Postuler maintenant
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Programmes;
