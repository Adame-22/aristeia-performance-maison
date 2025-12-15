import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Kinesitherapie = () => {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Santé & Performance", href: "/sante" },
    { label: "Kinésithérapie" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <Heart className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
              KINÉSITHÉRAPIE <span className="text-primary">DU SPORT</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-12 leading-relaxed">
              Bilan, prévention des blessures, rééducation fonctionnelle centrée performance.
            </p>
            <Button
              variant="cta-primary"
              size="lg"
              onClick={() => window.location.href = "mailto:adame.gilot@gmail.com?subject=Contact Kiné Aristeia"}
              className="text-base md:text-lg px-8 py-6"
            >
              Prendre contact
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Kinesitherapie;
