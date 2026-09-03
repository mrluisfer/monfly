import { SearchIcon, SparklesIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "~/components/layout/PageHeader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { CATEGORY_ICONS } from "~/constants/categories/icons";
import { Badge } from "../ui/badge";

export function AvailableIconsGallery() {
  const [searchValue, setSearchValue] = useState("");

  const normalizedQuery = searchValue.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0;

  const sortedIcons = useMemo(
    () =>
      [...CATEGORY_ICONS].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    [],
  );

  const filteredIcons = useMemo(() => {
    if (!isFiltering) {
      return sortedIcons;
    }
    return sortedIcons.filter((icon) => {
      const haystacks = [icon.name, icon.label, ...(icon.aliases ?? [])];
      return haystacks.some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [sortedIcons, isFiltering, normalizedQuery]);

  return (
    <section aria-label="Available icons" className="space-y-4">
      <PageHeader
        icon={<SparklesIcon className="size-5" aria-hidden="true" />}
        title={`Available icons (${sortedIcons.length})`}
        description="Browse every icon you can pick when creating or editing a category."
        actions={
          <div className="relative w-full sm:w-80">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/60"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search icon, label or alias…"
              aria-label="Search available icons"
              className="h-10 w-full rounded-xl border-border/60 bg-input/40 pl-9 text-sm shadow-none"
            />
          </div>
        }
      />

      {filteredIcons.length === 0 ? (
        <Empty className="rounded-2xl border border-border/60 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted">
              <SearchIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No matches</EmptyTitle>
            <EmptyDescription>
              No icon matches{" "}
              <span className="font-medium text-foreground">
                &ldquo;{searchValue}&rdquo;
              </span>
              .
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {filteredIcons.map(({ name, label, Icon, aliases }) => (
            <li
              key={name}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 text-center text-card-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
            >
              <div
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              >
                <Icon className="size-5" />
              </div>
              <p className="w-full truncate font-medium text-sm">{label}</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge variant={"default"}>{name}</Badge>
                {aliases?.map((alias) => (
                  <Badge key={alias} variant={"secondary"} className="text-xs">
                    {alias}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
