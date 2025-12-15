import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            ENVIE DE REJOINDRE <span className="text-primary">ARISTEIA</span> ?
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 mb-8">
            Parle-nous de ton objectif, on te répondra rapidement.
          </p>
          <Button
            variant="cta-primary"
            size="lg"
            onClick={() => window.location.href = "/contact"}
            className="text-base md:text-lg px-8 py-6"
          >
            Nous contacter
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
