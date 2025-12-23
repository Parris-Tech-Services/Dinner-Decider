import Dexie, { type Table } from 'dexie';

export const cuisineTypes = [
  "Pizza", "Thai", "Burgers", "Sushi", "Fish & Chips", 
  "Indian", "Mexican", "Chinese", "Vietnamese", "Italian", "Other"
] as const;

export const priceLevels = ["$", "$$", "$$$"] as const;
export const fatCautionLevels = ["Low", "Med", "High"] as const;

export interface TakeawayOption {
  id?: number;
  name: string;
  cuisineTags: string[];
  priceLevel: typeof priceLevels[number];
  kidFriendlyScore: number; // 1-5
  dairyFreeFriendly: "Yes" | "No" | "Notes";
  healthyScore: number; // 1-5
  fatCaution: typeof fatCautionLevels[number];
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  notes?: string;
  lastOrderedAt?: Date;
  rating?: number;
}

export interface HistoryItem {
  id?: number;
  optionId: number;
  optionName: string;
  date: Date;
  rating?: number;
}

export class TakeawayTonightDB extends Dexie {
  options!: Table<TakeawayOption>;
  history!: Table<HistoryItem>;

  constructor() {
    super('TakeawayTonightDB');
    this.version(1).stores({
      options: '++id, name, *cuisineTags, priceLevel, kidFriendlyScore, healthyScore, lastOrderedAt',
      history: '++id, date, optionId'
    });
  }
}

export const db = new TakeawayTonightDB();

// Seed data if empty
export async function seedDatabase() {
  const count = await db.options.count();
  if (count === 0) {
    const seedData: TakeawayOption[] = [
      { name: "Luigi's Pizza", cuisineTags: ["Pizza", "Italian"], priceLevel: "$$", kidFriendlyScore: 5, dairyFreeFriendly: "Notes", healthyScore: 2, fatCaution: "High", deliveryAvailable: true, pickupAvailable: true, notes: "Kids love the pepperoni. Ask for vegan cheese for dairy-free." },
      { name: "Golden Dragon", cuisineTags: ["Chinese"], priceLevel: "$", kidFriendlyScore: 4, dairyFreeFriendly: "Yes", healthyScore: 3, fatCaution: "Med", deliveryAvailable: true, pickupAvailable: true, notes: "Steamed dumplings are great." },
      { name: "Sushi Train", cuisineTags: ["Sushi", "Japanese"], priceLevel: "$$", kidFriendlyScore: 5, dairyFreeFriendly: "Yes", healthyScore: 5, fatCaution: "Low", deliveryAvailable: false, pickupAvailable: true, notes: "Get the avocado rolls." },
      { name: "Burger Shack", cuisineTags: ["Burgers"], priceLevel: "$", kidFriendlyScore: 5, dairyFreeFriendly: "No", healthyScore: 1, fatCaution: "High", deliveryAvailable: true, pickupAvailable: true, notes: "" },
      { name: "Thai Spice", cuisineTags: ["Thai"], priceLevel: "$$", kidFriendlyScore: 3, dairyFreeFriendly: "Yes", healthyScore: 4, fatCaution: "Med", deliveryAvailable: true, pickupAvailable: true, notes: "Pad See Ew is kid safe." },
      { name: "Ocean Blue Fish", cuisineTags: ["Fish & Chips"], priceLevel: "$$", kidFriendlyScore: 5, dairyFreeFriendly: "Yes", healthyScore: 2, fatCaution: "High", deliveryAvailable: false, pickupAvailable: true, notes: "Grilled fish option is healthier." },
      { name: "Bombay Bliss", cuisineTags: ["Indian"], priceLevel: "$$", kidFriendlyScore: 3, dairyFreeFriendly: "Yes", healthyScore: 3, fatCaution: "Med", deliveryAvailable: true, pickupAvailable: true, notes: "Butter chicken is mild." },
      { name: "Viet Street", cuisineTags: ["Vietnamese"], priceLevel: "$", kidFriendlyScore: 4, dairyFreeFriendly: "Yes", healthyScore: 5, fatCaution: "Low", deliveryAvailable: true, pickupAvailable: true, notes: "Pho is great for colds." },
      { name: "Mexico City", cuisineTags: ["Mexican"], priceLevel: "$$", kidFriendlyScore: 4, dairyFreeFriendly: "Yes", healthyScore: 3, fatCaution: "Med", deliveryAvailable: true, pickupAvailable: true, notes: "Build your own tacos kit." },
      { name: "Pasta House", cuisineTags: ["Italian"], priceLevel: "$$$", kidFriendlyScore: 5, dairyFreeFriendly: "No", healthyScore: 2, fatCaution: "Med", deliveryAvailable: true, pickupAvailable: true, notes: "" },
    ];
    await db.options.bulkAdd(seedData);
  }
}
