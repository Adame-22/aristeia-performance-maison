import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qui peut rejoindre Aristeia ?",
    answer:
      "Aristeia est ouvert à tous les athlètes sérieux, qu'ils soient débutants ou confirmés. L'important est l'état d'esprit : ambition, engagement et volonté de progresser. Nous adaptons la programmation à votre niveau.",
  },
  {
    question: "Quelle est la différence avec une salle de sport classique ?",
    answer:
      "Nous ne sommes pas une salle de sport, nous sommes un centre de performance. Coaching individualisé, programmation scientifique, approche holistique (force, nutrition, récupération). Pas de machines cardio, que de la performance athlétique.",
  },
  {
    question: "Combien de séances par semaine ?",
    answer:
      "Autant que tu veux : l'accès est illimité quelle que soit l'offre choisie.",
  },
  {
    question: "Faut-il avoir de l'expérience en force athlétique ?",
    answer:
      "Non. Nos programmes Base et Build sont conçus pour tous les niveaux. Nous enseignons les fondamentaux et construisons des progressions solides. L'essentiel est d'être prêt à apprendre et à s'investir.",
  },
  {
    question: "Puis-je essayer avant de m'engager ?",
    answer:
      "Oui, cliquez sur 'Demander un essai' pour réserver une séance découverte. Vous rencontrerez l'équipe, testerez nos installations et discuterez de vos objectifs.",
  },
  {
    question: "Les tarifs incluent-ils le coaching personnalisé ?",
    answer:
      "Oui. Tous nos programmes incluent un suivi technique et une programmation adaptée. Le niveau de personnalisation augmente avec le programme choisi (Base, Build, Peak).",
  },
  {
    question: "Où se trouve Aristeia ?",
    answer:
      "Nous sommes basés à Genève. L'adresse exacte sera communiquée lors de votre demande d'essai ou d'inscription.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            <span className="text-primary">FAQ</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80">
            Questions fréquentes. Réponses claires.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
