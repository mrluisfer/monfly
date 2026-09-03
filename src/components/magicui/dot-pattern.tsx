import { useId } from "react";
import { cn } from "~/lib/utils";

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  cr?: number;
  cx?: number;
  cy?: number;
  glow?: boolean;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={`${id}-pat`}
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} className="fill-neutral-400/80">
            {glow ? (
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-pat)`} />
    </svg>
  );
}
