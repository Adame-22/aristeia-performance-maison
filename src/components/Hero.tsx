import { Button } from "./ui/button";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 18, 23, 0.7), rgba(15, 18, 23, 0.9)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 tracking-wide leading-none">
            <span className="text-primary drop-shadow-lg">ARISTEIA</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wider">POWER HOUSE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-4 max-w-2xl mx-auto font-medium">
            La Maison de la Performance à Genève.<br />
            Donnons-nous enfin les moyens. Atteins ton sommet.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-primary font-semibold mb-10 max-w-2xl mx-auto">
            Séances illimitées pour tous les membres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="cta-primary"
              size="lg"
              onClick={() => scrollToSection("programmes")}
              className="text-base md:text-lg px-8 py-6"
            >
              Découvrir la Méthode
            </Button>
            <Button
              variant="cta-secondary"
              size="lg"
              onClick={() => scrollToSection("evenements")}
              className="text-base md:text-lg px-8 py-6"
            >
              Voir les événements
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
