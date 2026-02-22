import { ReactNode } from "react";
import { DollarSign, Percent, Star } from "lucide-react";

import demoImg from "../../assets/demo.png";
import { Safari } from "../magicui/safari";
import { Typography } from "../typography";
import { Separator } from "../ui/separator";

export function UserStatsSection() {
  return (
    <section className="pt-20 px-4 md:px-0 bg-background dark:bg-zinc-950">
      <h3 className="font-bold text-xl sm:text-2xl md:text-3xl mb-2 text-center">
        <Typography variant="muted">
          Empowering{" "}
          <Typography className="text-primary" variant="foreground">
            200,000+
          </Typography>{" "}
          users to take <Typography variant="primary">control</Typography> of
          their <Typography variant="primary">finances</Typography>
        </Typography>
      </h3>

      <div className="flex items-center justify-center mt-8 px-2">
        <div className="border rounded-2xl p-4 sm:p-6 md:p-8 items-center flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
          <UserStatItem label="Avg. Rating">
            4.9
            <Star className="w-5 h-5 text-primary" />
          </UserStatItem>
          <Separator orientation="vertical" />
          {/* User Satisfaction */}
          <UserStatItem label="User Satisfaction">
            98
            <Percent className="w-5 h-5 text-primary" />
          </UserStatItem>
          <Separator orientation="vertical" />
          <UserStatItem label="Annual Earnings">
            <DollarSign className="w-5 h-5 text-primary" />
            900
            <Typography variant="muted" className="text-sm pt-2">
              k
            </Typography>
          </UserStatItem>
        </div>
      </div>

      <div className="relative flex items-center justify-center mt-10 lg:max-w-4xl lg:mx-auto">
        <Safari url="monfly.vercel.app" imageSrc={demoImg} />
      </div>
    </section>
  );
}

function UserStatItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center group">
      <span className="text-2xl sm:text-3xl font-bold flex items-center gap-1 group-hover:text-primary group-hover:scale-105 transition-all">
        {children}
      </span>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
