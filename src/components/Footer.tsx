import { Instagram, Send, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-off-white py-12 md:py-16 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div>
            <h3 className="font-display text-3xl mb-3 tracking-wider">ARISTEIA</h3>
            <p className="text-off-white/70 text-sm leading-relaxed">
              Maison de la Performance.
              <br />
              Ambition. Vérité. Force. Excellence. Transmission.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-3 tracking-wide">Contact</h4>
            <ul className="space-y-2 text-off-white/70 text-sm">
              <li>
                <a
                  href="mailto:contact@aristeia.ch"
                  className="hover:text-primary transition-colors"
                >
                  contact@aristeia.ch
                </a>
              </li>
              <li>Genève, Suisse</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-display text-xl mb-3 tracking-wide">Suivez-nous</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/aristeia_ph"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card hover:bg-primary rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://tiktok.com/@aristeia_ph"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card hover:bg-primary rounded-full transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <Send size={20} />
              </a>
              <a
                href="https://linkedin.com/company/aristeia-power-house"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card hover:bg-primary rounded-full transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-off-white/20 py-12 my-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="font-display text-2xl mb-3 tracking-wide">Reste informé</h4>
            <p className="text-off-white/70 text-sm mb-6 leading-relaxed">
              Dates des mock meets, stages techniques, et événements communauté — en premier pour les abonnés.
            </p>
            <form
              method="post"
              action="https://example.com/newsletter/subscribe"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="ton@email.com"
                required
                className="flex-1 px-4 py-3 rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-[#1658C7] text-white font-semibold rounded-md transition-colors"
              >
                S'abonner
              </button>
            </form>
            <label className="flex items-center justify-center gap-2 mt-4 text-xs text-off-white/60">
              <input type="checkbox" name="consent" required className="rounded" />
              J'accepte de recevoir les informations Aristeia (désabonnement possible)
            </label>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-off-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-off-white/60">
          <p>© {new Date().getFullYear()} Aristeia Power House. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
