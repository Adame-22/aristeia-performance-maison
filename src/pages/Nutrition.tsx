import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";

const Nutrition = () => {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Santé & Performance", href: "/sante" },
    { label: "Nutrition" },
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
              <Apple className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
              NUTRITION <span className="text-primary">(DIÉTÉTICIENNE)</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              Suivi nutritionnel professionnel, réalisé par diététicienne diplômée. Objectif : performance durable et santé.
            </p>
            <Button
              variant="cta-primary"
              size="lg"
              onClick={() => window.location.href = "mailto:adame.gilot@gmail.com?subject=Contact Kiné Aristeia"}
              className="text-base md:text-lg px-8 py-6 mb-8"
            >
              Prendre contact
            </Button>
            <div className="bg-card border border-border rounded-lg p-6 mt-8">
              <p className="text-sm text-foreground/70 italic">
                Note légale : Aristeia ne réalise pas d'actes de diététique. Les plans sont établis par des professionnels diplômés.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Nutrition;
