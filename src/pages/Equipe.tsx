import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import coach1 from "@/assets/team/coach-1.jpg";
import physio from "@/assets/team/physio.jpg";
import osteo from "@/assets/team/osteo.jpg";
import nutritionist from "@/assets/team/nutritionist.jpg";

const teamMembers = [
  {
    name: "Alexandre Martin",
    role: "Coach Principal & Fondateur",
    image: coach1,
    bio: "Ancien athlète de force athlétique, certifié NSCA-CSCS. 10 ans d'expérience dans le coaching de performance. Spécialiste en programmation individualisée et préparation physique d'élite.",
    email: "alexandre@aristeia.ch",
  },
  {
    name: "Dr. Sophie Leclerc",
    role: "Kinésithérapeute du Sport",
    image: physio,
    bio: "Docteur en kinésithérapie, spécialisée en rééducation sportive et prévention des blessures. Travaille avec des athlètes de haut niveau depuis 8 ans. Approche fonctionnelle et centrée sur la performance.",
    email: "sophie.leclerc@aristeia.ch",
  },
  {
    name: "Marc Dubois",
    role: "Ostéopathe D.O.",
    image: osteo,
    bio: "Diplômé en ostéopathie structurelle et fonctionnelle. 15 ans d'expérience auprès d'athlètes de force. Spécialiste en optimisation de la mobilité et récupération active.",
    email: "marc.dubois@aristeia.ch",
  },
  {
    name: "Laura Fontaine",
    role: "Diététicienne Diplômée",
    image: nutritionist,
    bio: "Diététicienne nutritionniste diplômée d'État, spécialisée en nutrition sportive et performance. Approche scientifique et personnalisée pour optimiser vos résultats sans compromis sur la santé.",
    email: "laura.fontaine@aristeia.ch",
  },
];

const Equipe = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Équipe" },
            ]}
          />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
              NOTRE <span className="text-primary">ÉQUIPE</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Des professionnels passionnés, unis par une seule mission : votre excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-2 tracking-wide">{member.name}</h3>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-foreground/80 leading-relaxed mb-4">{member.bio}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="font-display text-3xl mb-4 tracking-wide">
                REJOINDRE <span className="text-primary">L'ÉQUIPE</span>
              </h2>
              <p className="text-foreground/80 mb-6">
                Nous sommes toujours à la recherche de professionnels passionnés et engagés. Si vous partagez nos valeurs et souhaitez contribuer à l'excellence d'Aristeia, contactez-nous.
              </p>
              <a
                href="mailto:contact@aristeia.ch?subject=Candidature - Rejoindre l'équipe"
                className="inline-block text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                contact@aristeia.ch
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Equipe;
