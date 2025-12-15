const Formulaire = () => {
  return (
    <section id="formulaire" className="py-20 md:py-28 bg-off-white text-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
            REJOIGNEZ LA <span className="text-primary">LISTE</span>
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80 mb-8">
            Intéressé par Aristeia ? Remplissez le formulaire ci-dessous pour recevoir toutes les informations et être notifié des ouvertures de places.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-charcoal p-8 md:p-12 rounded-lg shadow-xl">
          <div className="aspect-[4/3] w-full">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSf_PLACEHOLDER_REPLACE_WITH_YOUR_GOOGLE_FORM_EMBED_URL/viewform?embedded=true"
              className="w-full h-full rounded"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
            >
              Chargement…
            </iframe>
          </div>
          <p className="text-off-white/60 text-sm text-center mt-6">
            Vos données sont traitées de manière confidentielle. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Formulaire;
