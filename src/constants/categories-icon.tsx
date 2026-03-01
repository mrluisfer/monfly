import { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  Car,
  CarTaxiFront,
  Clapperboard,
  Coffee,
  Coins,
  CreditCard,
  Dumbbell,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  HousePlus,
  Landmark,
  Laptop,
  PawPrint,
  PiggyBank,
  Plane,
  Receipt,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Soup,
  Sun,
  Ticket,
  TrainFront,
  TrendingDown,
  TrendingUp,
  Tv,
  Umbrella,
  Users,
  Utensils,
  Wallet,
  Waves,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";

type CategoryIconDef = {
  name: string;
  label: string;
  Icon: LucideIcon;
  aliases?: string[];
};

export const CATEGORY_ICONS: CategoryIconDef[] = [
  {
    name: "income",
    label: "Income",
    Icon: ArrowUp,
    aliases: ["earning", "revenue", "arrow-up", "ArrowUpIcon"],
  },
  {
    name: "expense",
    label: "Expense",
    Icon: ArrowDown,
    aliases: ["cost", "spending", "arrow-down", "ArrowDownIcon"],
  },
  {
    name: "salary",
    label: "Salary",
    Icon: Briefcase,
    aliases: ["payroll", "job", "BriefcaseIcon"],
  },
  {
    name: "freelance",
    label: "Freelance",
    Icon: Laptop,
    aliases: ["contract", "developer", "LaptopIcon"],
  },
  {
    name: "business",
    label: "Business",
    Icon: Landmark,
    aliases: ["company", "office", "LandmarkIcon"],
  },
  {
    name: "investment",
    label: "Investment",
    Icon: TrendingUp,
    aliases: ["portfolio", "stocks", "TrendingUpIcon"],
  },
  {
    name: "investment-loss",
    label: "Investment Loss",
    Icon: TrendingDown,
    aliases: ["loss", "downtrend", "TrendingDownIcon"],
  },
  {
    name: "bonus",
    label: "Bonus",
    Icon: Coins,
    aliases: ["reward", "extra", "CoinsIcon"],
  },
  {
    name: "refund",
    label: "Refund",
    Icon: Wallet,
    aliases: ["cashback", "reimbursement", "WalletIcon"],
  },
  {
    name: "savings",
    label: "Savings",
    Icon: PiggyBank,
    aliases: ["save", "piggy-bank", "PiggyBankIcon"],
  },
  {
    name: "debt",
    label: "Debt",
    Icon: HandCoins,
    aliases: ["loan", "credit", "HandCoinsIcon"],
  },
  {
    name: "rent",
    label: "Rent",
    Icon: Home,
    aliases: ["housing", "home", "HomeIcon"],
  },
  {
    name: "mortgage",
    label: "Mortgage",
    Icon: HousePlus,
    aliases: ["house-plus", "HousePlusIcon"],
  },
  {
    name: "home-maintenance",
    label: "Home Maintenance",
    Icon: Wrench,
    aliases: ["repair", "maintenance", "WrenchIcon"],
  },
  {
    name: "utilities",
    label: "Utilities",
    Icon: Wifi,
    aliases: ["utility", "services", "WifiIcon"],
  },
  {
    name: "electricity",
    label: "Electricity",
    Icon: Zap,
    aliases: ["power", "energy", "ZapIcon"],
  },
  {
    name: "water",
    label: "Water",
    Icon: Waves,
    aliases: ["waves", "WavesIcon"],
  },
  {
    name: "phone",
    label: "Phone",
    Icon: Smartphone,
    aliases: ["mobile", "SmartphoneIcon"],
  },
  {
    name: "groceries",
    label: "Groceries",
    Icon: ShoppingCart,
    aliases: ["supermarket", "ShoppingCartIcon"],
  },
  {
    name: "food",
    label: "Food",
    Icon: Utensils,
    aliases: ["meal", "dining", "UtensilsIcon"],
  },
  {
    name: "dining",
    label: "Dining Out",
    Icon: Soup,
    aliases: ["restaurant", "lunch", "dinner", "SoupIcon"],
  },
  {
    name: "coffee",
    label: "Coffee",
    Icon: Coffee,
    aliases: ["cafe", "CoffeeIcon"],
  },
  {
    name: "transport",
    label: "Transport",
    Icon: Bus,
    aliases: ["transportation", "bus", "BusIcon"],
  },
  {
    name: "fuel",
    label: "Fuel",
    Icon: Fuel,
    aliases: ["gas", "gasoline", "petrol", "FuelIcon"],
  },
  {
    name: "car",
    label: "Car",
    Icon: Car,
    aliases: ["vehicle", "CarIcon"],
  },
  {
    name: "taxi",
    label: "Taxi",
    Icon: CarTaxiFront,
    aliases: ["uber", "cab", "CarTaxiFrontIcon"],
  },
  {
    name: "public-transport",
    label: "Public Transport",
    Icon: TrainFront,
    aliases: ["train", "metro", "TrainFrontIcon"],
  },
  {
    name: "travel",
    label: "Travel",
    Icon: Plane,
    aliases: ["trip", "flight", "PlaneIcon"],
  },
  {
    name: "hotel",
    label: "Hotel",
    Icon: Umbrella,
    aliases: ["stay", "accommodation", "UmbrellaIcon"],
  },
  {
    name: "shopping",
    label: "Shopping",
    Icon: ShoppingBag,
    aliases: ["store", "ShoppingBagIcon"],
  },
  {
    name: "clothing",
    label: "Clothing",
    Icon: Shirt,
    aliases: ["apparel", "ShirtIcon"],
  },
  {
    name: "gift",
    label: "Gift",
    Icon: Gift,
    aliases: ["present", "GiftIcon"],
  },
  {
    name: "subscription",
    label: "Subscription",
    Icon: CreditCard,
    aliases: ["recurring", "CreditCardIcon"],
  },
  {
    name: "entertainment",
    label: "Entertainment",
    Icon: Clapperboard,
    aliases: ["movie", "cinema", "ClapperboardIcon"],
  },
  {
    name: "streaming",
    label: "Streaming",
    Icon: Tv,
    aliases: ["tv", "TvIcon"],
  },
  {
    name: "gaming",
    label: "Gaming",
    Icon: Gamepad2,
    aliases: ["games", "Gamepad2Icon"],
  },
  {
    name: "events",
    label: "Events",
    Icon: Ticket,
    aliases: ["tickets", "concert", "TicketIcon"],
  },
  {
    name: "health",
    label: "Health",
    Icon: HeartPulse,
    aliases: ["medical", "clinic", "HeartPulseIcon"],
  },
  {
    name: "fitness",
    label: "Fitness",
    Icon: Dumbbell,
    aliases: ["gym", "workout", "DumbbellIcon"],
  },
  {
    name: "insurance",
    label: "Insurance",
    Icon: Shield,
    aliases: ["coverage", "ShieldIcon"],
  },
  {
    name: "education",
    label: "Education",
    Icon: GraduationCap,
    aliases: ["school", "study", "GraduationCapIcon"],
  },
  {
    name: "books",
    label: "Books",
    Icon: BookOpen,
    aliases: ["book", "reading", "BookOpenIcon"],
  },
  {
    name: "taxes",
    label: "Taxes",
    Icon: Receipt,
    aliases: ["tax", "ReceiptIcon"],
  },
  {
    name: "social",
    label: "Social",
    Icon: Users,
    aliases: ["friends", "community", "UsersIcon"],
  },
  {
    name: "family",
    label: "Family",
    Icon: Users,
    aliases: ["household"],
  },
  {
    name: "pets",
    label: "Pets",
    Icon: PawPrint,
    aliases: ["pet", "PawPrintIcon"],
  },
  {
    name: "work",
    label: "Work",
    Icon: Building2,
    aliases: ["office-building", "Building2Icon"],
  },
  { name: "other", label: "Other", Icon: Sun, aliases: ["misc", "SunIcon"] },
];

const normalizeCategoryIconKey = (value: string) =>
  value.trim().toLowerCase().replaceAll("_", "-").replace(/\s+/g, "-");

const toPascalCase = (value: string) =>
  normalizeCategoryIconKey(value)
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join("");

const categoryIconsByName = new Map<string, CategoryIconDef>();

for (const iconDef of CATEGORY_ICONS) {
  const keys = new Set([
    iconDef.name,
    iconDef.label,
    toPascalCase(iconDef.name),
    `${toPascalCase(iconDef.name)}Icon`,
    ...(iconDef.aliases ?? []),
  ]);

  for (const key of keys) {
    const normalizedKey = normalizeCategoryIconKey(key);
    if (!categoryIconsByName.has(normalizedKey)) {
      categoryIconsByName.set(normalizedKey, iconDef);
    }
  }
}

const fallbackCategoryIcon =
  CATEGORY_ICONS.find((icon) => icon.name === "other") ?? CATEGORY_ICONS[0];

export const getCategoryIconDefinition = (name: string) => {
  const normalizedName = normalizeCategoryIconKey(name);
  return categoryIconsByName.get(normalizedName) ?? fallbackCategoryIcon;
};

export const getCanonicalCategoryIconName = (name: string) =>
  getCategoryIconDefinition(name).name;

export const getCategoryIconLabelByName = (name: string) =>
  getCategoryIconDefinition(name).label;

export const getCategoryIconsWithSize = (width: number, height: number) =>
  CATEGORY_ICONS.map(({ name, label, Icon }) => ({
    name,
    label,
    icon: <Icon width={width} height={height} />,
  }));

export function getCategoryIconByName(
  name: string,
  props?: ComponentProps<LucideIcon>
) {
  const { Icon } = getCategoryIconDefinition(name);
  return <Icon {...props} />;
}
