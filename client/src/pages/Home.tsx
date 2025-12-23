import { useState, useEffect } from "react";
import { useTakeawayOptions, useTakeawayHistory } from "@/hooks/use-takeaway";
import { seedDatabase, TakeawayOption } from "@/lib/db";
import { calculateDecision, DecisionFilters, ScoredOption } from "@/lib/decision";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TakeawayCard } from "@/components/TakeawayCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChefHat, Utensils, RotateCcw, Lock, SlidersHorizontal, ArrowRight, Wallet, Baby, Leaf, MilkOff, History as HistoryIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Home() {
  const { options, isLoading } = useTakeawayOptions();
  const { addToHistory } = useTakeawayHistory();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"filters" | "results">("filters");
  const [results, setResults] = useState<ScoredOption[]>([]);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedForLock, setSelectedForLock] = useState<TakeawayOption | null>(null);

  const [filters, setFilters] = useState<DecisionFilters>({
    mode: "delivery",
    maxBudget: "$$$",
    kidFriendly: false,
    dairyFree: true,
    healthy: true,
    noRepeats: true,
  });

  // Initial seed check
  useEffect(() => {
    seedDatabase();
  }, []);

  const handleDecide = () => {
    if (options.length === 0) return;
    
    // Filter -> Exclude previously rejected in this session -> Calculate
    const pool = options.filter(opt => !excludedIds.includes(opt.id!));
    const calculated = calculateDecision(pool, filters);
    
    setResults(calculated);
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReroll = () => {
    if (results.length > 0) {
      const rejectedId = results[0].option.id!;
      setExcludedIds(prev => [...prev, rejectedId]);
      
      // Recalculate immediately with new exclusion
      const pool = options.filter(opt => !excludedIds.includes(opt.id!) && opt.id !== rejectedId);
      const calculated = calculateDecision(pool, filters);
      setResults(calculated);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLockIn = (option: TakeawayOption) => {
    setSelectedForLock(option);
    setShowConfirm(true);
  };

  const confirmLockIn = async () => {
    if (selectedForLock) {
      await addToHistory(selectedForLock);
      setShowConfirm(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#14B8A6', '#FFD700']
      });
      toast({
        title: "Dinner is sorted!",
        description: `Enjoy your meal from ${selectedForLock.name}!`,
      });
      // Optionally reset or navigate, for now staying on result
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <ChefHat className="w-12 h-12 text-primary/50 mb-4" />
          <p className="text-muted-foreground font-medium">Preparing kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-4xl font-display font-extrabold text-foreground mb-2">
          Takeaway<br/><span className="text-primary">Tonight</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          No more arguments. Let's pick dinner.
        </p>
      </header>

      <main className="px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step === "filters" ? (
            <motion.div
              key="filters"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Main Mode Toggle */}
              <div className="grid grid-cols-2 bg-muted p-1 rounded-2xl">
                <button
                  onClick={() => setFilters({ ...filters, mode: "delivery" })}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    filters.mode === "delivery" 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setFilters({ ...filters, mode: "pickup" })}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    filters.mode === "pickup" 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pickup
                </button>
              </div>

              {/* Quick Filters Card */}
              <Card className="p-6 space-y-6 shadow-sm border-border/60">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <Label className="font-semibold text-base">Max Budget</Label>
                    </div>
                    <div className="flex bg-muted rounded-lg p-1">
                      {["$", "$$", "$$$"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFilters({ ...filters, maxBudget: lvl as any })}
                          className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${
                            filters.maxBudget === lvl 
                              ? "bg-white text-primary shadow-sm" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <MilkOff className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="font-semibold text-base">Dairy Free</Label>
                        <p className="text-xs text-muted-foreground">Prioritise safe options</p>
                      </div>
                    </div>
                    <Switch 
                      checked={filters.dairyFree}
                      onCheckedChange={(c) => setFilters({ ...filters, dairyFree: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
                        <Baby className="w-5 h-5" />
                      </div>
                      <Label className="font-semibold text-base">Kid Friendly</Label>
                    </div>
                    <Switch 
                      checked={filters.kidFriendly}
                      onCheckedChange={(c) => setFilters({ ...filters, kidFriendly: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <Label className="font-semibold text-base">Healthy-ish</Label>
                    </div>
                    <Switch 
                      checked={filters.healthy}
                      onCheckedChange={(c) => setFilters({ ...filters, healthy: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                        <HistoryIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="font-semibold text-base">No Repeats</Label>
                        <p className="text-xs text-muted-foreground">Skip last 7 days</p>
                      </div>
                    </div>
                    <Switch 
                      checked={filters.noRepeats}
                      onCheckedChange={(c) => setFilters({ ...filters, noRepeats: c })}
                    />
                  </div>
                </div>
              </Card>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  variant="gradient"
                  className="w-full text-lg h-16 shadow-xl shadow-primary/20"
                  onClick={handleDecide}
                >
                  <Utensils className="mr-2 w-6 h-6" />
                  Decide Dinner
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {results.length > 0 ? (
                <>
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-display font-bold">Top Pick</h2>
                      <Button variant="ghost" size="sm" onClick={() => setStep("filters")}>
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                    <TakeawayCard 
                      option={results[0].option} 
                      reasons={results[0].reasons}
                      featured 
                    />
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button 
                        size="lg" 
                        variant="gradient" 
                        className="w-full"
                        onClick={() => handleLockIn(results[0].option)}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Lock it in
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full border-2"
                        onClick={handleReroll}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Re-roll
                      </Button>
                    </div>
                  </motion.div>

                  {results.length > 1 && (
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-bold text-muted-foreground mb-3 uppercase tracking-wider text-xs">Runner Ups</h3>
                      <div className="space-y-3">
                        {results.slice(1, 4).map((res, idx) => (
                          <div key={res.option.id} className="relative group" onClick={() => handleLockIn(res.option)}>
                            <TakeawayCard 
                              option={res.option} 
                              rank={idx + 2}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No places matched your strict filters!</p>
                  <Button onClick={() => setStep("filters")} className="mt-4">Try relaxing filters</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center pt-2">Lock in {selectedForLock?.name}?</DialogTitle>
            <DialogDescription className="text-center text-base">
              Great choice! We'll save this to your history.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-xl text-center my-2">
            <p className="font-medium text-foreground">Suggestion:</p>
            <p className="text-muted-foreground italic">"15 min walk outside after dinner?"</p>
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="gradient" className="flex-1" onClick={confirmLockIn}>Yes, let's eat!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
