import { CircleAlertIcon, LightbulbIcon } from "lucide-react";
import Card from "~/components/shared/Card";

interface ImprovementIdeasCardProps {
  ideas: string[];
}

export function ImprovementIdeasCard({ ideas }: ImprovementIdeasCardProps) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <LightbulbIcon className="size-4 text-warning" aria-hidden="true" />
          Improvement ideas
        </span>
      }
      subtitle="Suggested next steps from the numbers above."
    >
      <ul className="space-y-2.5" aria-label="Improvement ideas list">
        {ideas.map((idea) => (
          <li
            key={idea}
            className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-muted-foreground text-sm"
          >
            <CircleAlertIcon
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
