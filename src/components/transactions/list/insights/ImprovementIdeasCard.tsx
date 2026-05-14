import { CircleAlertIcon, LightbulbIcon } from "lucide-react";

type ImprovementIdeasCardProps = {
  ideas: string[];
};

export function ImprovementIdeasCard({ ideas }: ImprovementIdeasCardProps) {
  return (
    <article className="bg-muted border-border/70 h-fit rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <LightbulbIcon className="text-accent-foreground size-4" />
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          Improvement ideas
        </h4>
      </div>

      <ul className="mt-3 space-y-2.5" aria-label="Improvement ideas list">
        {ideas.map((idea) => (
          <li
            key={idea}
            className="border-border/70 bg-background/60 text-muted-foreground flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm"
          >
            <CircleAlertIcon className="text-primary mt-0.5 size-4 shrink-0" />
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
