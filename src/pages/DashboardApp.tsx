import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardState, Role, VbtSet, CoachAlert, ChatMessage, SubscriptionTier } from "@/hooks/useDashboardState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import {
  Dumbbell,
  Shield,
  Activity,
  User,
  QrCode,
  Calendar,
  Layers,
  ShoppingBag,
  AlertTriangle,
  Stethoscope,
  Send,
  Download,
  Check,
  X,
  RefreshCw,
  Flame,
  CheckCircle,
  FileText
} from "lucide-react";

const DashboardApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load our state manager
  const ds = useDashboardState();

  // Local state for UI inputs
  const [activeExercise, setActiveExercise] = useState<"squat" | "bench" | "deadlift">("squat");
  const [load, setLoad] = useState<number>(140);
  const [reps, setReps] = useState<number>(5);
  const [velocity, setVelocity] = useState<number>(0.5);
  const [velocityLoss, setVelocityLoss] = useState<number>(10);
  const [rpe, setRPE] = useState<number>(8);
  const [isSimulatingVbt, setIsSimulatingVbt] = useState<boolean>(false);

  // Recovery booking simulation
  const [isBookingCryo, setIsBookingCryo] = useState(false);
  const [showCryoQr, setShowCryoQr] = useState(false);

  // New message text state
  const [newMessageText, setNewMessageText] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState("Coach Marc");

  // Shaker generator state
  const [showShakerQr, setShowShakerQr] = useState(false);
  const [shakerFormula, setShakerFormula] = useState({ whey: 0, creatine: 0, malto: 0 });

  // PubMed PDF download simulation
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Standalone public user name
  const userName = "Adame (Achiever)";

  // Simulate VBT linear transducer signal
  const handleSimulateVbt = () => {
    setIsSimulatingVbt(true);
    setTimeout(() => {
      let speedFactor = 0.5;
      if (activeExercise === "bench") speedFactor = 0.4;
      if (activeExercise === "deadlift") speedFactor = 0.35;

      const simulatedSpeed = parseFloat((speedFactor - (rpe - 7) * 0.04 - (load > 150 ? 0.05 : 0) + Math.random() * 0.04).toFixed(2));
      const simulatedLoss = Math.round(10 + (reps * 1.5) + Math.random() * 5);

      setVelocity(simulatedSpeed);
      setVelocityLoss(simulatedLoss);
      setIsSimulatingVbt(false);

      toast({
        title: "Transducteur appairé en Bluetooth ✅",
        description: `Mesure captée : ${simulatedSpeed} m/s (Perte : ${simulatedLoss}%)`,
      });
    }, 1500);
  };

  const handleLogSet = () => {
    ds.addVbtSet({
      exercise: activeExercise,
      load: ds.sncReductionLoadApplied ? Math.round(load * 0.9) : load,
      reps,
      velocity,
      velocityLoss,
      rpe,
    });

    toast({
      title: "Série VBT enregistrée",
      description: `Données VBT injectées avec succès dans l'algorithme d'auto-régulation.`,
    });
  };

  // Generate Shaker Formula based on workout volume
  const handleFinalizeSession = () => {
    const totalVolume = ds.vbtSets
      .filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
      .reduce((sum, s) => sum + (s.load * s.reps), 0);

    if (totalVolume === 0) {
      toast({
        title: "Aucun volume d'entraînement détecté aujourd'hui",
        description: "Enregistre au moins une série VBT pour calculer ta formule de shaker post-entraînement.",
        variant: "destructive"
      });
      return;
    }

    const whey = Math.min(40, Math.round(20 + totalVolume / 100));
    const creatine = 5;
    const malto = Math.min(60, Math.round(25 + totalVolume / 80));

    setShakerFormula({ whey, creatine, malto });
    setShowShakerQr(true);
  };

  // Generate mock PubMed PDF
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `ARISTEIA ATHLETICS - REPORT EXPORT v3.3\n`,
        `=======================================\n`,
        `ATHLETE: ${userName}\n`,
        `DATE EXPORT: ${new Date().toLocaleDateString()}\n`,
        `SUBSCRIPTION TIER: ${ds.subscription}\n\n`,
        `ANALYTICAL METRICS:\n`,
        `- Bone ratio Femur/Tibia: ${ds.athleteProfile.ratios.femurTibia}\n`,
        `- Joint limitations: ${ds.restrictions.join(", ") || "Aucune"}\n`,
        `- Target nutrition mode: ${ds.nutritionMode.toUpperCase()}\n\n`,
        `LAST VBT LOGS:\n`,
        ds.vbtSets.map(s => `  * [${s.timestamp.split('T')[0]}] ${s.exercise.toUpperCase()}: ${s.load}kg x ${s.reps} reps (V_mean: ${s.velocity}m/s, RPE: ${s.rpe}, Est. 1RM: ${s.estimated1RM}kg)`).join("\n")
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `aristeia_rapport_clinique_${userName.toLowerCase().replace(" ", "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsGeneratingPdf(false);
      toast({
        title: "Rapport PubMed exporté",
        description: "Le rapport clinique de force au format brut (.txt) a été téléchargé.",
      });
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const senderName = ds.role === "athlete" ? userName : ds.role === "coach" ? "Coach Marc" : "Dr. Sophie (Kiné)";
    ds.sendMessage(senderName, selectedChatUser, newMessageText);
    setNewMessageText("");

    toast({
      title: "Message envoyé",
      description: `Transmis à ${selectedChatUser}.`,
    });
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 ${
      ds.role === "athlete" && ds.sncFatigueAlertActive 
        ? "ring-4 ring-cyan-500 ring-inset shadow-[0_0_50px_rgba(6,182,212,0.3)]" 
        : ""
    }`}>
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Application Aristeia v3.3 (Standalone)" }]} />

          {/* Premium Role Switcher Header */}
          <div className="bg-card/40 border border-border backdrop-blur-md p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <h2 className="font-display text-lg tracking-wider text-muted-foreground uppercase">Plateforme d'Automatisation PaaS (Accès Libre)</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Basculez entre les rôles pour tester la boucle fermée de l'application.</p>
            </div>
            <div className="flex gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={ds.role === "athlete" ? "default" : "ghost"}
                size="sm"
                onClick={() => ds.setRole("athlete")}
                className="gap-1.5"
              >
                <Dumbbell className="h-4 w-4" />
                Athlète
              </Button>
              <Button
                variant={ds.role === "coach" ? "default" : "ghost"}
                size="sm"
                onClick={() => ds.setRole("coach")}
                className="gap-1.5"
              >
                <Shield className="h-4 w-4" />
                Coach
              </Button>
              <Button
                variant={ds.role === "health" ? "default" : "ghost"}
                size="sm"
                onClick={() => ds.setRole("health")}
                className="gap-1.5"
              >
                <Stethoscope className="h-4 w-4" />
                Pôle Santé
              </Button>
            </div>
          </div>

          {/* ATHLETE DASHBOARD */}
          {ds.role === "athlete" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* SNC Alert Notification Banner */}
              {ds.sncFatigueAlertActive && (
                <div className="bg-cyan-950/80 border border-cyan-500 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-display tracking-wide font-bold">MODE AJUSTEMENT ÉLECTRIQUE BLUE ACTIF</h3>
                      <p className="text-sm text-cyan-200">
                        Baisse cinétique du SNC détectée (&gt;15%). Volume et charges réduits de 10% pour aujourd'hui.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-900" 
                    size="sm"
                    onClick={ds.clearSncFatigue}
                  >
                    Réinitialiser la fatigue
                  </Button>
                </div>
              )}

              {/* Grid layout */}
              <div className="grid gap-8 lg:grid-cols-3">
                
                {/* LEFT COLUMN */}
                <div className="space-y-8">
                  {/* Numerus Clausus QR */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <QrCode className="text-primary h-5 w-5" />
                        Numerus Clausus Access
                      </CardTitle>
                      <CardDescription>Jauge de fréquentation du club en temps réel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Présences estimées :</span>
                        <span className="font-bold">{ds.clubCapacity} / 100 athlètes</span>
                      </div>
                      <Progress value={ds.clubCapacity} className={ds.isNumerusClaususBlocked ? "bg-destructive/30" : ""} />
                      
                      <div className="bg-muted p-2 rounded text-xs text-muted-foreground">
                        💡 <strong>Simuler la fréquentation :</strong> Utilisez le curseur ci-dessous pour saturer le club (90%+) et tester le blocage de l'accès QR.
                      </div>
                      <Slider 
                        value={[ds.clubCapacity]} 
                        onValueChange={(val) => ds.setClubCapacity(val[0])} 
                        max={100} 
                        step={1}
                      />

                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg bg-card/60 mt-4">
                        {ds.isNumerusClaususBlocked ? (
                          <div className="text-center py-6">
                            <X className="h-16 w-16 text-destructive mx-auto mb-2 animate-bounce" />
                            <Badge variant="destructive" className="mb-2">ACCÈS VERROUILLÉ</Badge>
                            <p className="text-xs text-muted-foreground max-w-xs">
                              Numerus Clausus atteint (90%+). Votre badge QR est temporairement inactif pour préserver la qualité du plateau.
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-32 h-32 bg-white p-2 rounded mx-auto mb-3 flex items-center justify-center">
                              <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-80">
                                  {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className={`rounded-sm ${(i * 7) % 3 === 0 ? "bg-black" : "bg-transparent"}`}></div>
                                  ))}
                              </div>
                            </div>
                            <Badge className="bg-emerald-600 mb-1">ACCÈS ACTIF</Badge>
                            <p className="text-xs text-muted-foreground">Formule {ds.subscription} - Scan au portique</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscriptions & Recovery */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="text-primary h-5 w-5" />
                        Abonnement & Récupération
                      </CardTitle>
                      <CardDescription>Options de niveau {ds.subscription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        {(["BASE", "SMART", "TOTAL"] as SubscriptionTier[]).map((tier) => (
                          <Button
                            key={tier}
                            variant={ds.subscription === tier ? "default" : "outline"}
                            className="flex-1 text-xs"
                            size="sm"
                            onClick={() => ds.setSubscription(tier)}
                          >
                            {tier}
                          </Button>
                        ))}
                      </div>

                      <div className="border border-border p-3 rounded-lg bg-card/50 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cryothérapie & Bottes :</span>
                          <span className="font-semibold">
                            {ds.subscription === "TOTAL" ? "Inclus (Gratuit)" : "Payant (15 €)"}
                          </span>
                        </div>
                      </div>

                      {!showCryoQr ? (
                        <Button 
                          className="w-full" 
                          disabled={isBookingCryo}
                          onClick={() => {
                            setIsBookingCryo(true);
                            setTimeout(() => {
                              setIsBookingCryo(false);
                              setShowCryoQr(true);
                              toast({
                                title: ds.subscription === "TOTAL" ? "Réservation cryo validée" : "Paiement Cryo Stripe validé (15 €)",
                                description: "Votre cabine est prête. Scannez le QR code au pôle de récupération."
                              });
                            }, 1000);
                          }}
                        >
                          {isBookingCryo ? "Réservation..." : "Réserver 1 séance Cryo"}
                        </Button>
                      ) : (
                        <div className="bg-muted p-3 rounded-lg text-center space-y-2">
                          <div className="text-xs font-semibold text-emerald-500">Cabine 2 réservée pour 14:30</div>
                          <div className="w-24 h-24 bg-white p-2 rounded mx-auto">
                            <div className="grid grid-cols-4 gap-2 w-full h-full opacity-60">
                              {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className={`rounded-sm ${(i * 5) % 2 === 0 ? "bg-black" : "bg-transparent"}`}></div>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setShowCryoQr(false)} className="text-xs text-muted-foreground">
                            Fermer le badge
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* MIDDLE & RIGHT COLUMNS */}
                <div className="space-y-8 lg:col-span-2">
                  
                  {/* VBT & SNC Log input */}
                  <Card className={`border-border transition-all duration-500 ${
                    ds.sncFatigueAlertActive 
                      ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                      : ""
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Activity className="text-primary h-5 w-5" />
                          Transducteur VBT (Bluetooth)
                        </span>
                        {ds.sncFatigueAlertActive && (
                          <Badge className="bg-cyan-500 animate-pulse text-black hover:bg-cyan-400">BLUE AUTO-REG</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Saisissez ou simulez la vitesse sur barre d'acier</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="grid grid-cols-3 gap-2">
                        {(["squat", "bench", "deadlift"] as const).map((ex) => (
                          <Button
                            key={ex}
                            variant={activeExercise === ex ? "default" : "outline"}
                            className="text-xs uppercase"
                            onClick={() => {
                              setActiveExercise(ex);
                              if (ex === "squat") setLoad(140);
                              if (ex === "bench") setLoad(95);
                              if (ex === "deadlift") setLoad(170);
                            }}
                          >
                            {ex}
                          </Button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Charge (kg)</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              value={ds.sncReductionLoadApplied ? Math.round(load * 0.9) : load} 
                              onChange={(e) => setLoad(Number(e.target.value))}
                              disabled={ds.sncReductionLoadApplied}
                            />
                            {ds.sncReductionLoadApplied && (
                              <Badge variant="outline" className="text-cyan-400 border-cyan-500 shrink-0">
                                -10% SNC
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Répétitions</Label>
                          <Input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} />
                        </div>
                      </div>

                      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Vitesse Moyenne Propulsive ($V_{mean}$) :</span>
                            <span className="font-bold text-primary">{velocity} m/s</span>
                          </div>
                          <Slider 
                            value={[velocity]} 
                            onValueChange={(val) => setVelocity(val[0])} 
                            min={0.15} 
                            max={1.2} 
                            step={0.01} 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Perte de vitesse ($\Delta V$) :</span>
                            <span className="font-bold text-primary">{velocityLoss} %</span>
                          </div>
                          <Slider 
                            value={[velocityLoss]} 
                            onValueChange={(val) => setVelocityLoss(val[0])} 
                            min={0} 
                            max={40} 
                            step={1} 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Intensité ressentie (RPE) :</span>
                            <span className="font-bold text-primary">{rpe} / 10</span>
                          </div>
                          <Slider 
                            value={[rpe]} 
                            onValueChange={(val) => setRPE(val[0])} 
                            min={5} 
                            max={10} 
                            step={0.5} 
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleSimulateVbt}
                          disabled={isSimulatingVbt}
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${isSimulatingVbt ? "animate-spin" : ""}`} />
                          Simuler Capteur (Bluetooth)
                        </Button>
                        <Button className="flex-1" onClick={handleLogSet}>
                          Enregistrer la Série
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* VBT History */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Historique Cinétique VBT</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ds.vbtSets.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">Aucune série VBT enregistrée aujourd'hui.</div>
                      ) : (
                        <div className="space-y-3">
                          {ds.vbtSets.map((set) => (
                            <div key={set.id} className="flex justify-between items-center p-3 border rounded-lg bg-card/60 hover:border-primary/50 transition-colors">
                              <div>
                                <Badge className="mr-2 uppercase" variant="outline">{set.exercise}</Badge>
                                <span className="font-bold">{set.load} kg</span> x <span>{set.reps} reps</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Vitesse: </span>
                                  <span className="font-semibold text-primary">{set.velocity} m/s</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">1RM Est: </span>
                                  <span className="font-semibold text-emerald-500">{set.estimated1RM} kg</span>
                                </div>
                                {set.isSncFatigued && (
                                  <Badge className="bg-cyan-900 border-cyan-500 text-cyan-400">SNC FATIGUE</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Closed-loop Medical & Nutrition Matrix */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="text-primary h-5 w-5" />
                          Matrice Médicale Fermée
                        </CardTitle>
                        <CardDescription>Restrictions et substitutions automatiques</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-xs text-muted-foreground">RESTRICTIONS CLINIQUES ACTIVES :</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ds.restrictions.map((res) => (
                              <Badge key={res} variant="destructive" className="text-[10px]">
                                {res}
                              </Badge>
                            ))}
                            {ds.restrictions.length === 0 && (
                              <Badge variant="secondary" className="text-[10px]">Aucune restriction clinique</Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <span className="text-xs text-muted-foreground">ALGORITHME DE SUBSTITUTION ARISTEIA :</span>
                          {ds.restrictions.includes("Conflit sous-acromial de l'épaule droite") && (
                            <div className="p-2 border border-destructive/30 rounded bg-destructive/10 text-xs space-y-1">
                              <div className="flex justify-between items-center text-destructive">
                                <span className="font-semibold line-through">Développé Militaire Barre</span>
                                <span>❌ Exclu</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                👉 Remplacé par : <strong>Développé Incliné Haltères Neutre</strong> (stimulus préservé).
                              </p>
                            </div>
                          )}

                          {ds.restrictions.includes("Déficit de flexion de cheville") && (
                            <div className="p-2 border border-destructive/30 rounded bg-destructive/10 text-xs space-y-1">
                              <div className="flex justify-between items-center text-destructive">
                                <span className="font-semibold line-through">Squat Arrière Lourd</span>
                                <span>❌ Exclu</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                👉 Remplacé par : <strong>Presse Unilatérale Déclinée</strong>.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Flame className="text-primary h-5 w-5" />
                          Nutrition Clinique Évolutive
                        </CardTitle>
                        <CardDescription>Objectifs caloriques auto-régulés</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          {(["standard", "heavy", "recovery"] as const).map((mode) => (
                            <Button
                              key={mode}
                              variant={ds.nutritionMode === mode ? "default" : "outline"}
                              size="sm"
                              className="flex-1 text-[10px] uppercase"
                              onClick={() => ds.setNutritionMode(mode)}
                            >
                              {mode === "standard" ? "Repos" : mode === "heavy" ? "Lourd" : "Récup SNC"}
                            </Button>
                          ))}
                        </div>

                        <div className="border border-border p-3 rounded bg-card/60 space-y-3">
                          {ds.nutritionMode === "heavy" ? (
                            <div className="space-y-1 text-xs">
                              <Badge className="bg-amber-600 mb-1">⚡ MODE VOLUME LOURD ACTIF</Badge>
                              <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                                <div className="bg-muted p-1 rounded">Prot: 200g</div>
                                <div className="bg-primary/20 p-1 rounded text-primary font-bold">Glu: 420g</div>
                                <div className="bg-muted p-1 rounded">Lip: 75g</div>
                              </div>
                            </div>
                          ) : ds.nutritionMode === "recovery" ? (
                            <div className="space-y-1 text-xs">
                              <Badge className="bg-cyan-600 mb-1">🛡️ MODE RÉCUPÉRATION SNC</Badge>
                              <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                                <div className="bg-muted p-1 rounded">Prot: 210g</div>
                                <div className="bg-muted p-1 rounded">Glu: 220g</div>
                                <div className="bg-cyan-950 text-cyan-400 p-1 rounded font-bold">Lip: 95g</div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1 text-xs">
                              <Badge variant="outline" className="mb-1">☕ STANDARD / REPOS</Badge>
                              <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                                <div className="bg-muted p-1 rounded">Prot: 190g</div>
                                <div className="bg-muted p-1 rounded">Glu: 310g</div>
                                <div className="bg-muted p-1 rounded">Lip: 80g</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Smart Shaker Bar */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <QrCode className="text-primary h-5 w-5" />
                        Smart Shaker Bar Automatisation
                      </CardTitle>
                      <CardDescription>Délivrance post-entraînement par QR Code</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!showShakerQr ? (
                        <Button className="w-full bg-gradient-to-r from-primary to-amber-600" onClick={handleFinalizeSession}>
                          Finaliser ma séance & Commander Shaker
                        </Button>
                      ) : (
                        <div className="bg-muted p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="space-y-2 text-xs text-left">
                            <Badge className="bg-primary">FORMULE OPTIMISÉE SÉANCE</Badge>
                            <div className="font-mono text-sm space-y-1">
                              <div>🍼 Isolat de Whey : <strong>{shakerFormula.whey}g</strong></div>
                              <div>🍬 Maltodextrine : <strong>{shakerFormula.creatine}g</strong></div>
                              <div>🧪 Créatine Creapure : <strong>{shakerFormula.malto}g</strong></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground pt-1">
                              Débit de 4.50 € sur Stripe.
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
                              <div className="grid grid-cols-4 gap-2 w-full h-full opacity-85">
                                {Array.from({ length: 16 }).map((_, i) => (
                                  <div key={i} className={`rounded-sm ${(i * 4) % 3 === 0 ? "bg-black" : "bg-transparent"}`}></div>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-1">Scannez au shaker bar</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Onboarding & PubMed */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="text-primary h-5 w-5" />
                          Onboarding Biomécanique
                        </CardTitle>
                        <CardDescription>Ratios anthropométriques de force</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label>Humerus (cm)</Label>
                            <Input 
                              type="number" 
                              value={ds.athleteProfile.humerus} 
                              onChange={(e) => ds.updateProfile({ humerus: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Fémur (cm)</Label>
                            <Input 
                              type="number" 
                              value={ds.athleteProfile.femur} 
                              onChange={(e) => ds.updateProfile({ femur: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Tibia (cm)</Label>
                            <Input 
                              type="number" 
                              value={ds.athleteProfile.tibia} 
                              onChange={(e) => ds.updateProfile({ tibia: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="bg-muted p-3 rounded space-y-2">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>Ratio Fémur / Tibia :</span>
                            <span className="font-bold">{ds.athleteProfile.ratios.femurTibia}</span>
                          </div>
                          {ds.athleteProfile.ratios.femurTibia > 1.1 ? (
                            <Badge variant="outline" className="border-amber-500 text-amber-500 text-[10px]">
                              ⚠️ Fémur Long : Levier difficile sur le Squat arrière.
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-500 text-[10px]">
                              ✅ Levier Squat optimal.
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="text-primary h-5 w-5" />
                          Rapport Clinique / PubMed
                        </CardTitle>
                        <CardDescription>Exportation des logs institutionnels</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          disabled={isGeneratingPdf} 
                          onClick={handleDownloadPdf}
                        >
                          {isGeneratingPdf ? "Génération..." : "Exporter le Rapport PubMed (TXT)"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* COACH DASHBOARD */}
          {ds.role === "coach" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  {/* Validation center */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="text-primary h-5 w-5" />
                        Centre de Validation IA
                      </CardTitle>
                      <CardDescription>Ajustements de charge à valider</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {ds.coachAlerts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Aucune alerte VBT à valider actuellement.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {ds.coachAlerts.map((alert) => (
                            <div 
                              key={alert.id} 
                              className={`p-4 border rounded-lg bg-card/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${
                                alert.status === "approved" 
                                  ? "border-emerald-500/50 bg-emerald-950/10" 
                                  : alert.status === "rejected" 
                                  ? "border-destructive/30 bg-destructive/5" 
                                  : "border-cyan-500/50 bg-cyan-950/10"
                              }`}
                            >
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-foreground">{alert.athleteName}</span>
                                  <Badge className="bg-cyan-500 text-black">{alert.exercise}</Badge>
                                </div>
                                <p className="text-xs text-cyan-400 font-semibold">
                                  👉 Suggestion IA : Réduction de -{alert.suggestedReduction}% (Nouvelle cible : {alert.suggestedLoad}kg)
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {alert.status === "pending" ? (
                                  <>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => ds.resolveCoachAlert(alert.id, "approved")}
                                    >
                                      Valider
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => ds.resolveCoachAlert(alert.id, "rejected")}
                                    >
                                      Ignorer
                                    </Button>
                                  </>
                                ) : (
                                  <Badge variant={alert.status === "approved" ? "default" : "outline"} className={alert.status === "approved" ? "bg-emerald-600" : ""}>
                                    {alert.status === "approved" ? "VALIDÉ" : "REJETÉ"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Realtime Plateau */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="text-primary h-5 w-5" />
                        Vue 360° du Plateau Technique
                      </CardTitle>
                      <CardDescription>Athlètes actuellement présents au club</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-card/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-semibold">{userName}</p>
                            <p className="text-xs text-muted-foreground">Formule TOTAL INSTITUT</p>
                          </div>
                        </div>
                        <Badge className={ds.sncFatigueAlertActive ? "bg-cyan-500 text-black animate-pulse" : "bg-emerald-600"}>
                          {ds.sncFatigueAlertActive ? "Ajustement Blue" : "Séance OK"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Direct Messages */}
                <Card className="border-border h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="text-primary h-5 w-5" />
                      Messagerie Sécurisée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedChatUser === "Adame" ? "default" : "outline"} 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => setSelectedChatUser("Adame")}
                      >
                        Adame
                      </Button>
                      <Button 
                        variant={selectedChatUser === "Dr. Sophie (Kiné)" ? "default" : "outline"} 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => setSelectedChatUser("Dr. Sophie (Kiné)")}
                      >
                        Dr. Sophie
                      </Button>
                    </div>

                    <div className="border border-border p-3 rounded-lg h-64 overflow-y-auto bg-card/50 space-y-2 flex flex-col">
                      {ds.messages
                        .filter(m => (m.sender === selectedChatUser && m.recipient === "Coach Marc") || (m.sender === "Coach Marc" && m.recipient === selectedChatUser))
                        .map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`p-2 rounded max-w-[85%] text-xs ${
                              msg.sender === "Coach Marc" 
                                ? "bg-primary text-primary-foreground self-end" 
                                : "bg-muted text-foreground self-start"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Message..." 
                        value={newMessageText} 
                        onChange={(e) => setNewMessageText(e.target.value)} 
                      />
                      <Button type="submit">Envoyer</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* PRACTITIONER DASHBOARD */}
          {ds.role === "health" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  {/* Clinical record */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="text-primary h-5 w-5" />
                        Dossier Clinique Numérique
                      </CardTitle>
                      <CardDescription>Sélection et édition des exclusions biomécaniques</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border border-border p-3 rounded bg-muted/40 text-sm">
                        <p className="font-semibold">Patient sélectionné : {userName}</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Restrictions biomécaniques actives :</Label>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="res-acromial" 
                              checked={ds.restrictions.includes("Conflit sous-acromial de l'épaule droite")} 
                              onCheckedChange={() => ds.toggleRestriction("Conflit sous-acromial de l'épaule droite")}
                            />
                            <Label htmlFor="res-acromial" className="text-sm font-medium leading-none cursor-pointer">
                              Conflit sous-acromial de l'épaule droite
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="res-cheville" 
                              checked={ds.restrictions.includes("Déficit de flexion de cheville")} 
                              onCheckedChange={() => ds.toggleRestriction("Déficit de flexion de cheville")}
                            />
                            <Label htmlFor="res-cheville" className="text-sm font-medium leading-none cursor-pointer">
                              Déficit de flexion de cheville
                            </Label>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => toast({ title: "Restrictions sauvegardées" })}
                      >
                        Enregistrer
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Prescription */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle>Portail de Prescription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Protocole de Réathlétisation</Label>
                        <Textarea placeholder="Instructions de rééducation..." />
                      </div>
                      <Button className="w-full" onClick={() => toast({ title: "Prescription envoyée" })}>
                        Envoyer au plateau VBT
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Direct Messages */}
                <Card className="border-border h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="text-primary h-5 w-5" />
                      Messagerie Sécurisée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedChatUser === "Adame" ? "default" : "outline"} 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => setSelectedChatUser("Adame")}
                      >
                        Adame
                      </Button>
                      <Button 
                        variant={selectedChatUser === "Coach Marc" ? "default" : "outline"} 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => setSelectedChatUser("Coach Marc")}
                      >
                        Coach Marc
                      </Button>
                    </div>

                    <div className="border border-border p-3 rounded-lg h-64 overflow-y-auto bg-card/50 space-y-2 flex flex-col">
                      {ds.messages
                        .filter(m => (m.sender === selectedChatUser && m.recipient === "Dr. Sophie (Kiné)") || (m.sender === "Dr. Sophie (Kiné)" && m.recipient === selectedChatUser))
                        .map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`p-2 rounded max-w-[85%] text-xs ${
                              msg.sender === "Dr. Sophie (Kiné)" 
                                ? "bg-primary text-primary-foreground self-end" 
                                : "bg-muted text-foreground self-start"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Message..." 
                        value={newMessageText} 
                        onChange={(e) => setNewMessageText(e.target.value)} 
                      />
                      <Button type="submit">Envoyer</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardApp;
