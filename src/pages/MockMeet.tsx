import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import NewsletterGate from "@/components/NewsletterGate";
import { Trophy } from "lucide-react";

const MockMeet = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Événements", href: "/evenements" },
                { label: "Mock Meets" },
              ]}
            />
            
            <div className="flex justify-center mb-8">
              <Trophy className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl text-center mb-8 tracking-tight">
              Mock Meets
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 text-center mb-12 leading-relaxed">
              Compétitions internes pour tester ta force dans une ambiance familiale et motivante.
            </p>

            <div className="bg-card border border-border rounded-lg p-8 md:p-12 mb-12">
              <h2 className="font-display text-3xl mb-6">Pourquoi participer ?</h2>
              <ul className="space-y-4 text-foreground/80 text-lg">
                <li>• Testez votre force maximale sur les trois mouvements</li>
                <li>• Vivez l'expérience d'une compétition officielle</li>
                <li>• Recevez des feedbacks personnalisés de nos coaches</li>
                <li>• Progressez dans une ambiance bienveillante et motivante</li>
              </ul>
            </div>

            <NewsletterGate
              category="mock_meet"
              formAction="https://example.com/newsletter/subscribe"
              signupHref="https://docs.google.com/forms/d/e/1FAIpQLSfkUabNm1Y_NM4aByHQfymT7GvNKzU-6peM9MDsEfU44bLIXQ/viewform"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MockMeet;
