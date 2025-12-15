const GoogleForm = () => {
  return (
    <section id="formulaire" className="py-20 md:py-28 bg-off-white text-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            RÉSERVER UN <span className="text-accent-blue">ÉCHANGE GRATUIT</span>
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80 mb-8">
            Remplis le formulaire ci-dessous, réponse sous 24h.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-charcoal p-8 md:p-12 rounded-lg shadow-xl">
          <div className="w-full h-[1500px]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfkUabNm1Y_NM4aByHQfymT7GvNKzU-6peM9MDsEfU44bLIXQ/viewform?embedded=true"
              className="w-full h-full rounded"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
            >
              Chargement…
            </iframe>
          </div>
          <div className="text-center mt-6">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfkUabNm1Y_NM4aByHQfymT7GvNKzU-6peM9MDsEfU44bLIXQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-blue-hover transition-colors inline-flex items-center gap-2"
            >
              Ouvrir dans un nouvel onglet →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleForm;
