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
  return <BoringAvatar name={name} variant="beam" size={size} />;
};

export default UserAvatar;
