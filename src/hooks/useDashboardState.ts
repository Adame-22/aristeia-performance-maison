import { useState, useEffect } from "react";

export type Role = "athlete" | "coach" | "health";
export type SubscriptionTier = "BASE" | "SMART" | "TOTAL";
export type NutritionMode = "standard" | "heavy" | "recovery";

export interface VbtSet {
  id: string;
  exercise: "squat" | "bench" | "deadlift";
  load: number;
  reps: number;
  velocity: number;
  velocityLoss: number;
  rpe: number;
  estimated1RM: number;
  timestamp: string;
  isSncFatigued: boolean;
}

export interface CoachAlert {
  id: string;
  athleteName: string;
  exercise: string;
  suggestedReduction: number; // e.g. -10
  originalLoad: number;
  suggestedLoad: number;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

export interface AthleteProfile {
  humerus: number;
  femur: number;
  tibia: number;
  injuryHistory: string;
  ratios: {
    femurTibia: number;
    armTorso: number;
  };
}

const STORAGE_PREFIX = "aristeia_v3_3_";

export const useDashboardState = () => {
  // 1. Role switcher
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + "role") as Role) || "athlete";
  });

  // 2. Athlete Onboarding Biomécanique
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "profile");
    return saved
      ? JSON.parse(saved)
      : {
          humerus: 32,
          femur: 44,
          tibia: 38,
          injuryHistory: "Légère tendinopathie rotulienne gauche en 2024.",
          ratios: { femurTibia: 1.15, armTorso: 0.85 },
        };
  });

  // 3. Subscription & Numerus Clausus
  const [subscription, setSubscription] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + "subscription") as SubscriptionTier) || "TOTAL";
  });
  const [clubCapacity, setClubCapacity] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "club_capacity");
    return saved ? parseInt(saved, 10) : 65; // default 65% capacity
  });

  // 4. Closed-loop Medical Restrictions
  const [restrictions, setRestrictions] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "restrictions");
    return saved ? JSON.parse(saved) : ["Conflit sous-acromial de l'épaule droite"];
  });

  // 5. VBT Data Sets
  const [vbtSets, setVbtSets] = useState<VbtSet[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "vbt_sets");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            exercise: "squat",
            load: 140,
            reps: 5,
            velocity: 0.45,
            velocityLoss: 8,
            rpe: 8,
            estimated1RM: 175,
            timestamp: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
            isSncFatigued: false,
          },
          {
            id: "2",
            exercise: "squat",
            load: 142,
            reps: 5,
            velocity: 0.43,
            velocityLoss: 9,
            rpe: 8.5,
            estimated1RM: 177,
            timestamp: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
            isSncFatigued: false,
          },
        ];
  });

  // 6. SNC Fatigue State & Ajustement Électrique Blue
  const [sncFatigueAlertActive, setSncFatigueAlertActive] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_PREFIX + "snc_alert") === "true";
  });
  const [sncReductionLoadApplied, setSncReductionLoadApplied] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_PREFIX + "snc_reduction_applied") === "true";
  });

  // 7. Nutrition Mode
  const [nutritionMode, setNutritionMode] = useState<NutritionMode>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + "nutrition_mode") as NutritionMode) || "standard";
  });

  // 8. Coach Validation Center Alerts
  const [coachAlerts, setCoachAlerts] = useState<CoachAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "coach_alerts");
    return saved ? JSON.parse(saved) : [];
  });

  // 9. Chat Messaging
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + "messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "m1",
            sender: "Coach Marc",
            recipient: "Adame",
            content: "Salut Adame, comment te sens-tu après la séance lourde de lundi ?",
            timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
          },
          {
            id: "m2",
            sender: "Adame",
            recipient: "Coach Marc",
            content: "Un peu fatigué au niveau des lombaires, mais la vitesse de barre était bonne !",
            timestamp: new Date(Date.now() - 3600 * 1000 * 3.5).toISOString(),
          },
          {
            id: "m3",
            sender: "Dr. Sophie (Kiné)",
            recipient: "Adame",
            content: "Bonjour Adame, j'ai mis à jour ta restriction d'épaule dans ton profil. Fais attention sur le développé incliné aujourd'hui.",
            timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
          },
        ];
  });

  // Persist states in LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "profile", JSON.stringify(athleteProfile));
  }, [athleteProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "subscription", subscription);
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "club_capacity", clubCapacity.toString());
  }, [clubCapacity]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "restrictions", JSON.stringify(restrictions));
  }, [restrictions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "vbt_sets", JSON.stringify(vbtSets));
  }, [vbtSets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "snc_alert", sncFatigueAlertActive.toString());
  }, [sncFatigueAlertActive]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "snc_reduction_applied", sncReductionLoadApplied.toString());
  }, [sncReductionLoadApplied]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "nutrition_mode", nutritionMode);
  }, [nutritionMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "coach_alerts", JSON.stringify(coachAlerts));
  }, [coachAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "messages", JSON.stringify(messages));
  }, [messages]);

  // Actions
  const updateProfile = (profile: Partial<AthleteProfile>) => {
    setAthleteProfile((prev) => {
      const next = { ...prev, ...profile };
      if (profile.femur && profile.tibia) {
        next.ratios.femurTibia = parseFloat((profile.femur / profile.tibia).toFixed(2));
      }
      return next;
    });
  };

  const addVbtSet = (set: Omit<VbtSet, "id" | "timestamp" | "isSncFatigued">) => {
    // Relationship Charge-Vitesse estimated 1RM calculation:
    // Simple 1RM estimate using linear VBT regression or standard RPE load formula (e.g. Brzycki/RPE)
    // Here we use V_mean relative calculations. Let's do a reliable formula:
    // 1RM = Load / (1.0278 - 0.0278 * Reps) + adjustment factor based on V_mean.
    // If reps=5, RPE=8 -> 1RM ~ Load / 0.81 (approx). Let's use RPE standard chart.
    const rpeFactor = 1 - (10 - set.rpe + (set.reps - 1)) * 0.03;
    const est1RM = Math.round(set.load / (rpeFactor > 0.5 ? rpeFactor : 0.8));

    // Determine SNC fatigue: check if velocity is 15% lower than average velocity for that exercise/load.
    // We simulate previous microcycle baseline velocity. For squat at 140kg:
    // Baseline: 0.52 m/s. If input is <= 0.44 m/s (15% drop), trigger SNC alarm.
    let isSncFatigued = false;
    let baselineVelocity = 0.52; // Default baseline for benchmarking
    
    if (set.exercise === "bench") baselineVelocity = 0.38;
    if (set.exercise === "deadlift") baselineVelocity = 0.32;
    
    if (set.velocity < baselineVelocity * 0.85) {
      isSncFatigued = true;
    }

    const newSet: VbtSet = {
      ...set,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      estimated1RM: est1RM,
      isSncFatigued,
    };

    setVbtSets((prev) => [newSet, ...prev]);

    if (isSncFatigued) {
      setSncFatigueAlertActive(true);
      // Auto-switch nutrition to recovery mode
      setNutritionMode("recovery");
      // Add a coach alert
      const newAlert: CoachAlert = {
        id: Math.random().toString(36).substring(7),
        athleteName: "Adame",
        exercise: set.exercise.toUpperCase(),
        suggestedReduction: 10,
        originalLoad: set.load,
        suggestedLoad: Math.round(set.load * 0.9),
        status: "pending",
        timestamp: new Date().toISOString(),
      };
      setCoachAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const resolveCoachAlert = (id: string, action: "approved" | "rejected") => {
    setCoachAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          return { ...alert, status: action };
        }
        return alert;
      })
    );
    if (action === "approved") {
      setSncReductionLoadApplied(true);
    }
  };

  const clearSncFatigue = () => {
    setSncFatigueAlertActive(false);
    setSncReductionLoadApplied(false);
    setNutritionMode("standard");
  };

  const toggleRestriction = (restriction: string) => {
    setRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const sendMessage = (sender: string, recipient: string, content: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender,
      recipient,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return {
    role,
    setRole,
    athleteProfile,
    updateProfile,
    subscription,
    setSubscription,
    clubCapacity,
    setClubCapacity,
    isNumerusClaususBlocked: clubCapacity >= 90,
    restrictions,
    toggleRestriction,
    vbtSets,
    addVbtSet,
    sncFatigueAlertActive,
    sncReductionLoadApplied,
    clearSncFatigue,
    nutritionMode,
    setNutritionMode,
    coachAlerts,
    resolveCoachAlert,
    messages,
    sendMessage,
  };
};
