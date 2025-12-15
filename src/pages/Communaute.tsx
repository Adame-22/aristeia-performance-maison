import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import NewsletterGate from "@/components/NewsletterGate";
import { Calendar } from "lucide-react";

const Communaute = () => {
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
                { label: "Événements Communautaires" },
              ]}
            />
            
            <div className="flex justify-center mb-8">
              <Calendar className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl text-center mb-8 tracking-tight">
              Événements Communautaires
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 text-center mb-12 leading-relaxed">
              Rencontres, soirées, workshops pour faire grandir la famille Aristeia.
            </p>

            <div className="bg-card border border-border rounded-lg p-8 md:p-12 mb-12">
              <h2 className="font-display text-3xl mb-6">Rejoins la communauté</h2>
              <ul className="space-y-4 text-foreground/80 text-lg">
                <li>• Challenges internes et défis mensuels</li>
                <li>• Workshops nutrition et récupération</li>
                <li>• Séances collectives spéciales</li>
                <li>• Soirées et événements sociaux</li>
                <li>• Échanges et partages entre membres</li>
              </ul>
            </div>

            <NewsletterGate
              category="communaute"
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

export default Communaute;
