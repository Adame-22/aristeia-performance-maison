import { Heart, Bone, Apple, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Heart,
    title: "Kinésithérapie du sport",
    description: "Prévention des blessures et récupération optimale.",
    link: "/sante/kinesitherapie",
  },
  {
    icon: Bone,
    title: "Ostéopathie",
    description: "Mobilité, équilibre structurel et performance durable.",
    link: "/sante/osteopathie",
  },
  {
    icon: Apple,
    title: "Nutrition",
    description: "Plans alimentaires personnalisés pour soutenir vos objectifs.",
    link: "/sante/nutrition",
  },
];

const Sante = () => {
  return (
    <section id="sante" className="py-20 md:py-28 bg-off-white text-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            SANTÉ & <span className="text-primary">RÉCUPÉRATION</span>
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80">
            La performance passe aussi par la prévention et la récupération. Nous collaborons avec des experts pour une approche globale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.link}
                className="bg-charcoal text-off-white p-8 rounded-lg hover:scale-105 transition-all duration-300 block"
              >
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-3 tracking-wide">{service.title}</h3>
                <p className="text-off-white/80 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Sante;
