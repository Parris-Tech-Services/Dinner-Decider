import { TakeawayOption } from "./db";

export type DecisionFilters = {
  mode: "pickup" | "delivery";
  maxBudget: "$" | "$$" | "$$$";
  kidFriendly: boolean;
  dairyFree: boolean;
  healthy: boolean;
  noRepeats: boolean;
};

export type ScoredOption = {
  option: TakeawayOption;
  score: number;
  reasons: string[];
};

const priceValues = { "$": 1, "$$": 2, "$$$": 3 };

export function calculateDecision(options: TakeawayOption[], filters: DecisionFilters): ScoredOption[] {
  // 1. Hard Filtering
  const eligible = options.filter(opt => {
    // Delivery/Pickup avail
    if (filters.mode === "delivery" && !opt.deliveryAvailable) return false;
    if (filters.mode === "pickup" && !opt.pickupAvailable) return false;
    
    // Budget (max filter)
    if (priceValues[opt.priceLevel] > priceValues[filters.maxBudget]) return false;

    // Dietary Hard Filter
    // If dairy-free is REQUIRED, and place says "No", exclude it.
    // If place says "Notes" or "Yes", keep it.
    if (filters.dairyFree && opt.dairyFreeFriendly === "No") return false;

    return true;
  });

  // 2. Scoring
  const scored = eligible.map(opt => {
    let score = 100;
    const reasons: string[] = [];

    // Base preference on mode
    score += 10; // Just for existing

    // Kid Friendly
    if (filters.kidFriendly) {
      if (opt.kidFriendlyScore >= 4) {
        score += 20;
        reasons.push("Kid friendly");
      } else if (opt.kidFriendlyScore <= 2) {
        score -= 20;
      }
    }

    // Healthy
    if (filters.healthy) {
      if (opt.healthyScore >= 4) {
        score += 20;
        reasons.push("Healthy choice");
      } else if (opt.healthyScore <= 2) {
        score -= 10;
      }
    }

    // Budget Bonus (if cheaper than max)
    if (priceValues[opt.priceLevel] < priceValues[filters.maxBudget]) {
      score += 5;
      reasons.push("Under budget");
    }

    // Dairy Free Positive
    if (filters.dairyFree && opt.dairyFreeFriendly === "Yes") {
      score += 10;
      reasons.push("Dairy-free friendly");
    }

    // Recency Penalty
    if (filters.noRepeats && opt.lastOrderedAt) {
      const daysSince = (new Date().getTime() - new Date(opt.lastOrderedAt).getTime()) / (1000 * 3600 * 24);
      if (daysSince < 7) {
        score -= 50; // Heavy penalty
      } else if (daysSince < 14) {
        score -= 20;
      } else {
        reasons.push("Not eaten recently");
      }
    } else if (filters.noRepeats && !opt.lastOrderedAt) {
      score += 5; // Slight boost for never tried
    }

    // Random noise (-5 to +5) to prevent deterministic stalemates
    const noise = Math.floor(Math.random() * 11) - 5;
    score += noise;

    return { option: opt, score, reasons };
  });

  // Sort by score descending
  return scored.sort((a, b) => b.score - a.score);
}
