import { CircleAlertIcon, LightbulbIcon } from "lucide-react";
import Card from "~/components/shared/Card";

type ImprovementIdeasCardProps = {
  ideas: string[];
};

export function ImprovementIdeasCard({ ideas }: ImprovementIdeasCardProps) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <LightbulbIcon className="text-warning size-4" aria-hidden="true" />
          Improvement ideas
        </span>
      }
      subtitle="Suggested next steps from the numbers above."
    >
      <ul className="space-y-2.5" aria-label="Improvement ideas list">
        {ideas.map((idea) => (
          <li
            key={idea}
            className="bg-muted/50 text-muted-foreground flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
          >
            <CircleAlertIcon
              className="text-primary mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
