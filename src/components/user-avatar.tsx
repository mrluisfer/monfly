import { notionists } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
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
  const avatar = useMemo(() => {
    return createAvatar(notionists, {
      seed: name ?? "",
      backgroundColor: ["#b6e3f4", "#c0aede", "#d1d4f9", "#ffd5dc", "#ffdfbf"],
      radius: 100,
    }).toDataUri();
  }, [name]);

  return (
    <>
      <Avatar className={`w-${size} h-${size}`}>
        <AvatarImage
          src={avatar}
          alt={alt}
          className="bg-secondary aspect-square shrink-0 rounded-full"
        />
        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </>
  );
};

export default UserAvatar;
