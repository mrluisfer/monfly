import BoringAvatar from "boring-avatars";

const UserAvatar = ({
  alt,
  name,
  size = 32,
}: {
  alt: string;
  name: string;
  size?: number;
}) => {
  return (
    <BoringAvatar
      className="rounded-sm"
      name={name}
      variant="beam"
      square
      size={size}
    />
  );
};

export default UserAvatar;
