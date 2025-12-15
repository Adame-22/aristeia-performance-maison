import { Users, Award, Heart } from "lucide-react";

const Equipe = () => {
  const teamMembers = [
    {
      icon: Users,
      title: "Coachs",
      description: "Experts en force athlétique et préparation physique",
    },
    {
      icon: Award,
      title: "Préparateurs physiques",
      description: "Spécialistes en performance et programmation",
    },
    {
      icon: Heart,
      title: "Staff santé",
      description: "Kinésithérapeutes, ostéopathes et nutritionnistes",
    },
  ];

  return (
    <section id="equipe" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            L'ÉQUIPE <span className="text-primary">ARISTEIA</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80">
            Une équipe de passionnés dédiée à ta progression, réunissant expertise technique et accompagnement humain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-3 tracking-tight">
                  {member.title}
                </h3>
                <p className="text-foreground/70">
                  {member.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Equipe;
