import { cn } from "~/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = ({
  alt,
  name,
  size,
}: {
  alt: string;
  name: string;
  size?: number;
}) => {
  return (
    <>
      <Avatar className={`w-${size} h-${size}`}>
        <AvatarImage
          src={""}
          alt={alt}
          className={cn(
            "bg-secondary aspect-square shrink-0 rounded-full",
            `w-${size} h-${size}`
          )}
        />
        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </>
  );
};

export default UserAvatar;
