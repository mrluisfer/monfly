import { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Building2,
  Bus,
  Car,
  Coins,
  CreditCard,
  Film,
  Gift,
  GraduationCap,
  Heart,
  Home,
  PiggyBank,
  Plane,
  Receipt,
  Shield,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sun,
  TrendingDown,
  TrendingUp,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";

type CategoryIconDef = {
  name: string;
  label: string;
  Icon: LucideIcon;
};

export const CATEGORY_ICONS: CategoryIconDef[] = [
  { name: "income", label: "Income", Icon: ArrowUp },
  { name: "expense", label: "Expense", Icon: ArrowDown },
  { name: "salary", label: "Salary", Icon: Briefcase },
  { name: "investment", label: "Investment", Icon: TrendingUp },
  { name: "food", label: "Food", Icon: Utensils },
  { name: "groceries", label: "Groceries", Icon: ShoppingCart },
  { name: "transport", label: "Transport", Icon: Bus },
  { name: "fuel", label: "Fuel", Icon: Car },
  { name: "rent", label: "Rent", Icon: Home },
  { name: "utilities", label: "Utilities", Icon: Wifi },
  { name: "health", label: "Health", Icon: Heart },
  { name: "entertainment", label: "Entertainment", Icon: Film },
  { name: "gift", label: "Gift", Icon: Gift },
  { name: "savings", label: "Savings", Icon: PiggyBank },
  { name: "education", label: "Education", Icon: GraduationCap },
  { name: "clothing", label: "Clothing", Icon: Shirt },
  { name: "insurance", label: "Insurance", Icon: Shield },
  { name: "subscription", label: "Subscription", Icon: CreditCard },
  { name: "travel", label: "Travel", Icon: Plane },
  { name: "phone", label: "Phone", Icon: Smartphone },
  { name: "taxes", label: "Taxes", Icon: Receipt },
  { name: "bonus", label: "Bonus", Icon: Coins },
  { name: "social", label: "Social", Icon: Users },
  { name: "investment-loss", label: "Investment Loss", Icon: TrendingDown },
  { name: "work", label: "Work", Icon: Building2 },
  { name: "other", label: "Other", Icon: Sun },
];

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
  const def = CATEGORY_ICONS.find((c) => c.name === name);
  return def ? <def.Icon {...props} /> : null;
}
