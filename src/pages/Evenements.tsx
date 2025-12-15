import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Trophy, Users, PartyPopper, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

type EventType = "mock_meet" | "stages" | "communaute";

interface Event {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  description: string;
  link: string;
}

// Événements d'exemple
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Mock Meet - Session Février",
    type: "mock_meet",
    date: new Date(2025, 11, 15), // 15 décembre 2025
    time: "14:00 - 18:00",
    location: "Aristeia Power House",
    description: "Compétition interne mensuelle sur les 3 mouvements",
    link: "/evenements/mock-meet",
  },
  {
    id: "2",
    title: "Stage Technique Squat",
    type: "stages",
    date: new Date(2025, 11, 20), // 20 décembre 2025
    time: "10:00 - 13:00",
    location: "Aristeia Power House",
    description: "Masterclass dédiée au perfectionnement du squat",
    link: "/evenements/stages",
  },
  {
    id: "3",
    title: "Soirée Communauté",
    type: "communaute",
    date: new Date(2025, 11, 22), // 22 décembre 2025
    time: "19:00 - 23:00",
    location: "Aristeia Power House",
    description: "Rencontre conviviale et barbecue entre membres",
    link: "/evenements/communaute",
  },
  {
    id: "4",
    title: "Stage Technique Bench Press",
    type: "stages",
    date: new Date(2026, 0, 10), // 10 janvier 2026
    time: "14:00 - 17:00",
    location: "Aristeia Power House",
    description: "Atelier spécialisé pour améliorer votre bench press",
    link: "/evenements/stages",
  },
  {
    id: "5",
    title: "Mock Meet - Session Mars",
    type: "mock_meet",
    date: new Date(2026, 0, 18), // 18 janvier 2026
    time: "14:00 - 18:00",
    location: "Aristeia Power House",
    description: "Compétition interne mensuelle sur les 3 mouvements",
    link: "/evenements/mock-meet",
  },
  {
    id: "6",
    title: "Workshop Nutrition",
    type: "communaute",
    date: new Date(2026, 0, 25), // 25 janvier 2026
    time: "11:00 - 13:00",
    location: "Aristeia Power House",
    description: "Atelier nutrition avec notre diététicienne",
    link: "/evenements/communaute",
  },
];

const eventTypeConfig = {
  mock_meet: {
    label: "Mock Meets",
    icon: Trophy,
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  stages: {
    label: "Stages Techniques",
    icon: Users,
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  communaute: {
    label: "Événements Communautaires",
    icon: PartyPopper,
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  },
};

const Evenements = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFilters, setSelectedFilters] = useState<EventType[]>([
    "mock_meet",
    "stages",
    "communaute",
  ]);

  const toggleFilter = (type: EventType) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredEvents = sampleEvents.filter((event) =>
    selectedFilters.includes(event.type)
  );

  const eventsOnSelectedDate = selectedDate
    ? filteredEvents.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  const eventDates = filteredEvents.map((event) => event.date);

  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersClassNames = {
    hasEvent: "bg-primary/20 font-bold",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="max-w-6xl mx-auto mb-8">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Événements" },
              ]}
            />
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-8">
              <CalendarIcon className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-6 tracking-tight">
              Calendrier des <span className="text-primary">Événements</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Retrouve tous nos événements à venir et réserve ta place en priorité.
            </p>
          </div>

          {/* Filtres */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="font-display text-2xl mb-6 text-center">Filtrer par type</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {(Object.keys(eventTypeConfig) as EventType[]).map((type) => {
                const config = eventTypeConfig[type];
                const Icon = config.icon;
                const isActive = selectedFilters.includes(type);

                return (
                  <Button
                    key={type}
                    variant="outline"
                    onClick={() => toggleFilter(type)}
                    className={cn(
                      "flex items-center gap-2 h-12 px-6 transition-all",
                      isActive
                        ? "bg-primary text-white border-primary hover:bg-[#1658C7]"
                        : "border-border hover:border-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Calendrier et Liste */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendrier */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="font-display text-2xl mb-6 text-center">
                Sélectionne une date
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className={cn("pointer-events-auto rounded-md border-0")}
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-foreground/60 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    ),
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside:
                      "day-outside text-foreground/30 opacity-50 aria-selected:bg-accent/50 aria-selected:text-foreground/30 aria-selected:opacity-30",
                    day_disabled: "text-foreground/30 opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>

            {/* Liste des événements */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="font-display text-2xl mb-6">
                {selectedDate
                  ? `Événements du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`
                  : "Tous les événements"}
              </h3>

              {eventsOnSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsOnSelectedDate.map((event) => {
                    const config = eventTypeConfig[event.type];
                    const Icon = config.icon;

                    return (
                      <Link
                        key={event.id}
                        to={event.link}
                        className="block bg-background/50 border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("p-3 rounded-lg", config.color)}>
                            <Icon className="w-6 h-6" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-display text-lg mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            <p className="text-foreground/70 text-sm mb-3">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PartyPopper
                    className="w-16 h-16 text-foreground/20 mx-auto mb-4"
                    strokeWidth={1.5}
                  />
                  <p className="text-foreground/60">
                    Aucun événement prévu pour cette date.
                  </p>
                  <p className="text-foreground/40 text-sm mt-2">
                    Les jours avec événements sont mis en évidence dans le calendrier.
                  </p>
                </div>
              )}

              {/* Tous les événements à venir */}
              {selectedDate && eventsOnSelectedDate.length === 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="font-display text-xl mb-4">Prochains événements</h4>
                  <div className="space-y-3">
                    {filteredEvents.slice(0, 3).map((event) => {
                      const config = eventTypeConfig[event.type];
                      const Icon = config.icon;

                      return (
                        <Link
                          key={event.id}
                          to={event.link}
                          className="flex items-center gap-3 p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors group"
                        >
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                          <div className="flex-1">
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {event.title}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {format(event.date, "d MMMM yyyy", { locale: fr })}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-card border border-border rounded-lg p-8 md:p-12">
              <h3 className="font-display text-3xl mb-4">
                Ne rate aucun événement
              </h3>
              <p className="text-foreground/80 text-lg mb-6">
                Inscris-toi à notre newsletter pour recevoir les dates en avant-première.
              </p>
              <Link to="/evenements/mock-meet">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-[#1658C7] text-white font-semibold px-8 py-6 text-lg"
                >
                  S'inscrire à la newsletter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Evenements;
