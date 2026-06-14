import type { LucideIcon } from "lucide-react";

import { ComponentProps } from "react";
import { CATEGORY_ICONS, CategoryIconDef } from "./icons";

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
  props?: ComponentProps<LucideIcon>,
) {
  const { Icon } = getCategoryIconDefinition(name);
  return <Icon {...props} />;
}
