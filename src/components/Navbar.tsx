import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { authState } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  const handleNavigation = (href: string, isPage: boolean = false) => {
    if (isPage) {
      window.location.href = href;
    } else {
      // Si on n'est pas sur la homepage, rediriger vers homepage avec hash
      if (window.location.pathname !== '/') {
        window.location.href = `/#${href}`;
      } else {
        scrollToSection(href);
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { label: "Accueil", href: "/", isPage: true },
    { label: "Programmes", href: "/programmes", isPage: true },
    { label: "Santé & Performance", href: "/sante", isPage: true },
    { label: "Événements", href: "/evenements", isPage: true },
    { label: "Équipe", href: "/equipe", isPage: true },
    { label: "Contact", href: "/contact", isPage: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.location.href = '/';
              }
            }}
            className="font-display text-2xl md:text-3xl tracking-wider hover:text-primary transition-colors"
          >
            ARISTEIA
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href, link.isPage)}
                className="text-foreground/80 hover:text-foreground font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            {authState.isLoggedIn ? (
              <Button
                variant="outline"
                size="default"
                onClick={() => window.location.href = "/compte"}
              >
                <User className="mr-2 h-4 w-4" />
                {authState.user?.user_metadata?.full_name || authState.user?.email?.split("@")[0] || "Mon compte"}
              </Button>
            ) : (
              <Button
                variant="cta-primary"
                size="default"
                onClick={() => window.location.href = "/connexion"}
              >
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href, link.isPage)}
                  className="text-foreground/80 hover:text-foreground font-medium text-left transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {authState.isLoggedIn ? (
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={() => window.location.href = "/compte"}
                >
                  <User className="mr-2 h-4 w-4" />
                  {authState.user?.user_metadata?.full_name || authState.user?.email?.split("@")[0] || "Mon compte"}
                </Button>
              ) : (
                <Button
                  variant="cta-primary"
                  size="default"
                  className="w-full"
                  onClick={() => window.location.href = "/connexion"}
                >
                  Connexion
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
