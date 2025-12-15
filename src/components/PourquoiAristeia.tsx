import { Target, TrendingUp, Users, Award } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Ambition",
    description: "Des objectifs clairs, des résultats mesurables. Nous visons l'excellence dans chaque mouvement.",
  },
  {
    icon: TrendingUp,
    title: "Vérité",
    description: "Zéro bullshit. Nous vous disons ce qui fonctionne vraiment, basé sur la science et l'expérience.",
  },
  {
    icon: Users,
    title: "Force",
    description: "Physique et mentale. Nous construisons des athlètes complets, résilients et performants.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "La performance maximale nécessite une approche systémique et un accompagnement expert.",
  },
];

const PourquoiAristeia = () => {
  return (
    <section id="pourquoi" className="py-20 md:py-28 bg-off-white text-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            POURQUOI <span className="text-primary">ARISTEIA</span>
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80">
            Parce que la performance ne se limite pas à la salle. C'est un état d'esprit, une méthode, un engagement total.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="bg-charcoal text-off-white p-8 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-3 tracking-wide">{pillar.title}</h3>
                <p className="text-off-white/80 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PourquoiAristeia;
