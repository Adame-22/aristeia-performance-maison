import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PourquoiAristeia from "@/components/PourquoiAristeia";
import Programmes from "@/components/Programmes";
import Sante from "@/components/Sante";
import Evenements from "@/components/Evenements";
import Equipe from "@/components/Equipe";
import Temoignages from "@/components/Temoignages";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Gère le scroll vers la section depuis un hash dans l'URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <PourquoiAristeia />
      <Programmes />
      <Sante />
      <Evenements />
      <Equipe />
      <Temoignages />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
