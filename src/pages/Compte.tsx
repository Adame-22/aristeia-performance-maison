import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useDashboardState, Role, VbtSet, CoachAlert, ChatMessage } from "@/hooks/useDashboardState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart,
  QrCode,
  Calendar,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Stethoscope,
  Send,
  Download,
  Check,
  X,
  RefreshCw,
  Plus,
  Flame,
  CheckCircle,
  FileText
} from "lucide-react";

const Compte = () => {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();
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

  const userName = authState.user?.user_metadata?.full_name || authState.user?.email?.split("@")[0] || "Membre Aristeia";

  // Simulate VBT linear transducer signal
  const handleSimulateVbt = () => {
    setIsSimulatingVbt(true);
    setTimeout(() => {
      // Formulate speed based on RPE and Load
      // Higher load/RPE = lower speed
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

    // Formula calculation based on mechanical load volume
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
    <ProtectedRoute>
      <div className={`min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 ${
        ds.role === "athlete" && ds.sncFatigueAlertActive 
          ? "ring-4 ring-cyan-500 ring-inset shadow-[0_0_50px_rgba(6,182,212,0.3)]" 
          : ""
      }`}>
        <Navbar />

        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Tableau de Bord PaaS" }]} />

            {/* Premium Role Switcher Header */}
            <div className="bg-card/40 border border-border backdrop-blur-md p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h2 className="font-display text-lg tracking-wider text-muted-foreground uppercase">Plateforme d'Automatisation PaaS</h2>
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
                  
                  {/* LEFT COLUMN: Access, Subscriptions & Health restrictions */}
                  <div className="space-y-8">
                    
                    {/* Club capacity & Numerus Clausus QR */}
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

                        {/* QR Code container */}
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
                                {/* Simulated QR Code */}
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

                    {/* Subscription billing & Recovery booking */}
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

                  {/* MIDDLE COLUMN: VBT Engine & Logs */}
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
                        <CardDescription>Configurez la charge pour injecter la vitesse moyenne propulsive</CardDescription>
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

                        {/* VBT Metric Sliders */}
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
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Lourd (&lt;0.4 m/s)</span>
                              <span>Dynamique (&gt;0.7 m/s)</span>
                            </div>
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

                    {/* VBT History Charts / Lists */}
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
                      
                      {/* Biomechanics Exclusions */}
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="text-primary h-5 w-5" />
                            Matrice Médicale Fermée
                          </CardTitle>
                          <CardDescription>Restrictions motrices et substitutions automatiques</CardDescription>
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
                            
                            {/* shoulder conflict sub */}
                            {ds.restrictions.includes("Conflit sous-acromial de l'épaule droite") && (
                              <div className="p-2 border border-destructive/30 rounded bg-destructive/10 text-xs space-y-1">
                                <div className="flex justify-between items-center text-destructive">
                                  <span className="font-semibold line-through">Développé Militaire Barre</span>
                                  <span>❌ Exclu</span>
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  👉 Remplacé par : <strong>Développé Incliné Haltères Neutre</strong> (Préservation du stimulus deltoïdes/pectoraux avec trajectoire neutre).
                                </div>
                              </div>
                            )}

                            {/* ankle sub */}
                            {ds.restrictions.includes("Déficit de flexion de cheville") && (
                              <div className="p-2 border border-destructive/30 rounded bg-destructive/10 text-xs space-y-1">
                                <div className="flex justify-between items-center text-destructive">
                                  <span className="font-semibold line-through">Squat Arrière Lourd</span>
                                  <span>❌ Exclu</span>
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  👉 Remplacé par : <strong>Presse Unilatérale Déclinée</strong> (Conserve le volume sur les quadriceps en minimisant l'amplitude de cheville nécessaire).
                                </div>
                              </div>
                            )}

                            {ds.restrictions.length === 0 && (
                              <div className="p-3 bg-muted rounded text-center text-xs text-muted-foreground">
                                Aucun filtre d'exclusion appliqué. Tous les exercices du plateau technique sont autorisés.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Clinical nutrition */}
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
                                <p className="text-[11px] text-muted-foreground">Augmentation automatique des glucides de 25% pour recharger le glycogène.</p>
                                <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                                  <div className="bg-muted p-1 rounded">Prot: 200g</div>
                                  <div className="bg-primary/20 p-1 rounded text-primary font-bold">Glu: 420g</div>
                                  <div className="bg-muted p-1 rounded">Lip: 75g</div>
                                </div>
                              </div>
                            ) : ds.nutritionMode === "recovery" ? (
                              <div className="space-y-1 text-xs">
                                <Badge className="bg-cyan-600 mb-1">🛡️ MODE RÉCUPÉRATION SNC</Badge>
                                <p className="text-[11px] text-muted-foreground">Diminution des glucides et augmentation des acides gras essentiels anti-inflammatoires.</p>
                                <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                                  <div className="bg-muted p-1 rounded">Prot: 210g</div>
                                  <div className="bg-muted p-1 rounded">Glu: 220g</div>
                                  <div className="bg-cyan-950 text-cyan-400 p-1 rounded font-bold">Lip: 95g</div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-xs">
                                <Badge variant="outline" className="mb-1">☕ STANDARD / REPOS</Badge>
                                <p className="text-[11px] text-muted-foreground">Objectif calorique standard de maintien.</p>
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

                    {/* Merch early access drop & SBD */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="text-primary h-5 w-5" />
                            ARISTEIA Athletics Drops
                          </CardTitle>
                          <CardDescription>Merchandising Premium Gated Access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span>Drop Collection "Titan" :</span>
                            <Badge variant="outline">Dans 14 heures</Badge>
                          </div>
                          <Progress value={85} />

                          {ds.subscription === "TOTAL" ? (
                            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-xs space-y-2">
                              <p className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                ACCÈS DEVERROUILLÉ (Elite Member)
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Votre abonnement TOTAL INSTITUT vous donne accès au drop 24h avant le public.
                              </p>
                              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                Pré-commander les pièces exclusives
                              </Button>
                            </div>
                          ) : (
                            <div className="bg-muted p-3 rounded-lg text-xs space-y-2 text-muted-foreground">
                              <p className="font-semibold text-foreground">🔒 ACCÈS PERSO BLOQUÉ</p>
                              <p className="text-[11px]">
                                Réservé uniquement aux abonnés TOTAL INSTITUT. Le grand public y aura accès dans 24h.
                              </p>
                              <Button size="sm" variant="outline" className="w-full" onClick={() => ds.setSubscription("TOTAL")}>
                                Passer en TOTAL INSTITUT pour débloquer
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="text-primary h-5 w-5" />
                            Stock SBD Apparel & Suppléments
                          </CardTitle>
                          <CardDescription>Réservation et distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="border border-border p-2 rounded bg-card/60 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Ceinture SBD à Levier (13mm)</p>
                              <p className="text-[11px] text-muted-foreground">Taille M - Réservation physique</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => toast({ title: "Ceinture bloquée en stock !", description: "Venez l'essayer à la boutique du club." })}>
                              Bloquer ma taille
                            </Button>
                          </div>

                          <div className="border border-border p-2 rounded bg-card/60 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Abonnement Whey + Créatine</p>
                              <p className="text-[11px] text-muted-foreground">Renouvellement mensuel Nutripure</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => toast({ title: "Abonnement Suppléments souscrit", description: "Facturé via Stripe mensuellement." })}>
                              Souscrire
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Smart Shaker QR Code trigger */}
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <QrCode className="text-primary h-5 w-5" />
                          Smart Shaker Bar Automatisation
                        </CardTitle>
                        <CardDescription>Délivrance physique micronutritionnelle post-entraînement</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">
                          Une fois vos séries terminées, finalisez la séance pour générer le QR Code de formulation du shaker.
                        </p>

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
                                Calculé sur la base de {ds.vbtSets.length} séries enregistrées. Débit de 4.50 € sur Stripe.
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

                    {/* Onboarding Biomécanique & PubMed Report */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Biomechanics Onboarding */}
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
                                ⚠️ Fémur Long : Levier difficile sur le Squat arrière lourd.
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-emerald-500 text-emerald-500 text-[10px]">
                                ✅ Levier Squat optimal (Fémur court).
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* PubMed Export */}
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download className="text-primary h-5 w-5" />
                            Rapport Clinique / PubMed
                          </CardTitle>
                          <CardDescription>Génération des logs institutionnels de performance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Génère un rapport scientifique complet prêt à être partagé avec votre médecin du sport ou entraîneur national.
                          </p>
                          <Button 
                            className="w-full" 
                            variant="outline" 
                            disabled={isGeneratingPdf} 
                            onClick={handleDownloadPdf}
                          >
                            {isGeneratingPdf ? "Génération du rapport..." : "Exporter le Rapport PubMed (TXT)"}
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
                  
                  {/* Left Column: Alerts Validation Center */}
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="text-primary h-5 w-5" />
                          Centre de Validation IA
                        </CardTitle>
                        <CardDescription>Ajustements de charge générés automatiquement à valider</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {ds.coachAlerts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            Aucune alerte VBT à valider actuellement. Le système nerveux des athlètes est stable.
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
                                    : "border-cyan-500/50 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                }`}
                              >
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">{alert.athleteName}</span>
                                    <Badge className="bg-cyan-500 text-black">{alert.exercise}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Fatigue SNC détectée. Charge originale : <span className="line-through">{alert.originalLoad}kg</span>.
                                  </p>
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
                                        onClick={() => {
                                          ds.resolveCoachAlert(alert.id, "approved");
                                          toast({ title: "Ajustement validé", description: "Charge abaissée de 10% sur l'athlète." });
                                        }}
                                      >
                                        <Check className="mr-1 h-4 w-4" /> Valider
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="border-destructive text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                          ds.resolveCoachAlert(alert.id, "rejected");
                                          toast({ title: "Ajustement rejeté", description: "L'athlète garde ses charges programmées." });
                                        }}
                                      >
                                        <X className="mr-1 h-4 w-4" /> Rejeter
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

                    {/* Plateau Real-time view */}
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="text-primary h-5 w-5" />
                          Vue 360° du Plateau Technique
                        </CardTitle>
                        <CardDescription>Athlètes actuellement présents au club</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {ds.clubCapacity === 0 ? (
                          <p className="text-center text-sm text-muted-foreground py-6">Aucun athlète dans le club pour le moment.</p>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 border rounded-lg bg-card/40">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                  <p className="font-semibold">{userName}</p>
                                  <p className="text-xs text-muted-foreground">Formule TOTAL INSTITUT</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Fatigue Nerveuse : </span>
                                  <span className={`font-bold ${ds.sncFatigueAlertActive ? "text-cyan-400" : "text-emerald-500"}`}>
                                    {ds.sncFatigueAlertActive ? "Élevée (Alerte SNC)" : "Normale"}
                                  </span>
                                </div>
                                <Badge className={ds.sncFatigueAlertActive ? "bg-cyan-500 text-black animate-pulse" : "bg-emerald-600"}>
                                  {ds.sncFatigueAlertActive ? "Ajustement Blue" : "Séance OK"}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 border rounded-lg bg-card/40">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-secondary text-secondary-foreground">TH</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                  <p className="font-semibold">Thomas Lemaire</p>
                                  <p className="text-xs text-muted-foreground">Formule SMART</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Fatigue Nerveuse : </span>
                                  <span className="font-bold text-emerald-400">Stable</span>
                                </div>
                                <Badge className="bg-emerald-600">Séance OK</Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Direct Messaging */}
                  <div className="space-y-8">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Send className="text-primary h-5 w-5" />
                          Messagerie Sécurisée
                        </CardTitle>
                        <CardDescription>Canal direct Plateau / Santé</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Button 
                            variant={selectedChatUser === "Adame" ? "default" : "outline"} 
                            className="flex-1 text-xs" 
                            size="sm"
                            onClick={() => setSelectedChatUser("Adame")}
                          >
                            Adame (Athlète)
                          </Button>
                          <Button 
                            variant={selectedChatUser === "Dr. Sophie (Kiné)" ? "default" : "outline"} 
                            className="flex-1 text-xs" 
                            size="sm"
                            onClick={() => setSelectedChatUser("Dr. Sophie (Kiné)")}
                          >
                            Dr. Sophie (Kiné)
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
                                <p className="font-semibold text-[10px] opacity-75">{msg.sender}</p>
                                <p>{msg.content}</p>
                              </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <Input 
                            placeholder="Écrire un message..." 
                            value={newMessageText} 
                            onChange={(e) => setNewMessageText(e.target.value)} 
                          />
                          <Button type="submit">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* PRACTITIONER DASHBOARD */}
            {ds.role === "health" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid gap-8 lg:grid-cols-3">
                  
                  {/* Left Column: Patient clinical record */}
                  <div className="lg:col-span-2 space-y-8">
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
                          <p className="text-xs text-muted-foreground mt-0.5">Biométrie : Fémur {ds.athleteProfile.femur}cm, Humerus {ds.athleteProfile.humerus}cm.</p>
                        </div>

                        {/* Exclusions toggles */}
                        <div className="space-y-4">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Restrictions biomécaniques actives (Fermeture de boucle) :</Label>
                          
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Checkbox 
                                id="res-acromial" 
                                checked={ds.restrictions.includes("Conflit sous-acromial de l'épaule droite")} 
                                onCheckedChange={() => ds.toggleRestriction("Conflit sous-acromial de l'épaule droite")}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="res-acromial" className="text-sm font-medium leading-none cursor-pointer">
                                  Conflit sous-acromial de l'épaule droite
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Exclut la barre au développé militaire et active la substitution par haltères prise neutre.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3">
                              <Checkbox 
                                id="res-cheville" 
                                checked={ds.restrictions.includes("Déficit de flexion de cheville")} 
                                onCheckedChange={() => ds.toggleRestriction("Déficit de flexion de cheville")}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="res-cheville" className="text-sm font-medium leading-none cursor-pointer">
                                  Déficit de flexion de cheville
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Exclut le Squat arrière lourd et active la substitution par la presse unilatérale.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Blood tests inputs */}
                        <div className="space-y-4 pt-4 border-t border-border">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Bilan biologique estimé :</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label>Ferritine (µg/L)</Label>
                              <Input type="number" defaultValue={110} />
                            </div>
                            <div className="space-y-1">
                              <Label>Vitamine D (ng/mL)</Label>
                              <Input type="number" defaultValue={45} />
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => {
                            toast({
                              title: "Dossier Médical Sauvegardé",
                              description: "Les filtres algorithmiques ont été recalculés pour le plateau technique."
                            });
                          }}
                        >
                          Enregistrer le bilan clinique
                        </Button>

                      </CardContent>
                    </Card>

                    {/* Prescription portal */}
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="text-primary h-5 w-5" />
                          Portail de Prescription
                        </CardTitle>
                        <CardDescription>Envoi direct de cibles nutritionnelles ou de protocoles de réathlétisation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Protocole de Réathlétisation</Label>
                          <Select defaultValue="coiffe">
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un protocole" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coiffe">Renforcement coiffe des rotateurs (Infra-épineux)</SelectItem>
                              <SelectItem value="patella">Excentrique patellaire (Protocole Stanish)</SelectItem>
                              <SelectItem value="mobility">Mobilité cheville flexion passive dorsale</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Instructions diététiques (Macro-nutrition)</Label>
                          <Textarea placeholder="Ex : Augmenter les acides gras oméga-3 à 5g/jour et maintenir 2g/kg de protéines..." />
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => {
                            toast({
                              title: "Prescription transmise",
                              description: "Les cibles de réathlétisation ont été fusionnées dans le plan d'entraînement de l'athlète."
                            });
                          }}
                        >
                          Prescrire au plan VBT de l'athlète
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Messenger */}
                  <div className="space-y-8">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Send className="text-primary h-5 w-5" />
                          Messagerie Sécurisée
                        </CardTitle>
                        <CardDescription>Canal direct Santé / Plateau</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Button 
                            variant={selectedChatUser === "Adame" ? "default" : "outline"} 
                            className="flex-1 text-xs" 
                            size="sm"
                            onClick={() => setSelectedChatUser("Adame")}
                          >
                            Adame (Athlète)
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
                                <p className="font-semibold text-[10px] opacity-75">{msg.sender}</p>
                                <p>{msg.content}</p>
                              </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <Input 
                            placeholder="Écrire un message..." 
                            value={newMessageText} 
                            onChange={(e) => setNewMessageText(e.target.value)} 
                          />
                          <Button type="submit">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Logout button */}
            <div className="flex justify-end mt-8">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={async () => {
                await signOut();
                navigate("/connexion");
              }}>
                Déconnexion
              </Button>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Compte;
