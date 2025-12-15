import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marc L.",
    role: "Athlète amateur",
    quote: "L'approche d'Aristeia est exactement ce que je cherchais : sérieuse, exigeante, sans compromis. Mes résultats ont explosé.",
  },
  {
    name: "Sophie M.",
    role: "Compétitrice Powerlifting",
    quote: "Enfin un centre qui comprend que la performance c'est 80% de méthode et 20% d'intensité. Les coachs sont exceptionnels.",
  },
  {
    name: "David K.",
    role: "CrossFit Athlete",
    quote: "Aristeia m'a permis de passer un cap. La programmation est solide, l'ambiance pousse à se dépasser chaque jour.",
  },
];

const Temoignages = () => {
  return (
    <section className="py-20 md:py-28 bg-off-white text-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            ILS NOUS FONT <span className="text-primary">CONFIANCE</span>
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80">
            Des résultats concrets, des témoignages authentiques. Pas de marketing, juste des athlètes qui progressent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-charcoal text-off-white p-8 rounded-lg relative hover:scale-105 transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-primary/30 absolute top-6 right-6" />
              <p className="text-off-white/90 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-off-white/20 pt-4">
                <p className="font-display text-xl tracking-wide">{testimonial.name}</p>
                <p className="text-off-white/70 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Temoignages;
