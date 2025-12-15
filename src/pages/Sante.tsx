import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SanteSection from "@/components/Sante";

const Sante = () => {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Santé & Performance" },
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
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
              SANTÉ & <span className="text-primary">PERFORMANCE</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              La performance passe aussi par la prévention et la récupération. Nous collaborons avec des experts pour une approche globale de votre santé.
            </p>
          </div>
        </div>
      </section>
      <SanteSection />
      <Footer />
    </div>
  );
};

export default Sante;
