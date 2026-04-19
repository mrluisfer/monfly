import { CircleAlertIcon, LightbulbIcon } from "lucide-react";

type ImprovementIdeasCardProps = {
  ideas: string[];
};

export function ImprovementIdeasCard({ ideas }: ImprovementIdeasCardProps) {
  return (
    <article className="bg-muted rounded-2xl border border-border/70 p-4 sm:p-5 h-fit">
      <div className="flex items-center gap-2">
        <LightbulbIcon className="size-4 text-accent-foreground" />
        <h4 className="text-base font-semibold tracking-tight text-foreground">
          Improvement ideas
        </h4>
      </div>

      <ul className="mt-3 space-y-2.5" aria-label="Improvement ideas list">
        {ideas.map((idea) => (
          <li
            key={idea}
            className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 text-sm text-muted-foreground"
          >
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
