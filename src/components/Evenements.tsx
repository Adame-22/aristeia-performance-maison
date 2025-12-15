import { Calendar, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    icon: Trophy,
    title: "Mock Meets",
    description: "Simulations de compétition pour tester votre force sous pression. Ambiance réelle, feedback direct.",
    frequency: "Mensuels",
    href: "/evenements/mock-meet",
  },
  {
    icon: Users,
    title: "Stages techniques",
    description: "Masterclasses avec des coaches experts. Perfectionnez vos mouvements et apprenez de nouveaux outils.",
    frequency: "Trimestriels",
    href: "/evenements/stages",
  },
  {
    icon: Calendar,
    title: "Événements communautaires",
    description: "Challenges internes, workshops nutrition, séances collectives. Parce que la performance se nourrit aussi du collectif.",
    frequency: "Variables",
    href: "/evenements/communaute",
  },
];

const Evenements = () => {
  return (
    <section id="evenements" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            ÉVÉNEMENTS & <span className="text-primary">COMMUNAUTÉ</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80">
            Entraînez-vous seul, progressez ensemble. Nous organisons régulièrement des événements pour challenger et fédérer notre communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <Link
                key={index}
                to={event.href}
                className="relative block bg-card border border-border p-8 rounded-lg hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  En savoir plus
                </div>
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-3 tracking-wide group-hover:underline">{event.title}</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">{event.description}</p>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-sm font-semibold">
                  {event.frequency}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Evenements;
