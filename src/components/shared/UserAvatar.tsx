import BoringAvatar from "boring-avatars";

const UserAvatar = ({
  name,
  size = 32,
}: {
  /** Accessible label kept for call-site semantics; BoringAvatar renders from `name`. */
  alt?: string;
  name: string;
  size?: number;
}) => {
  return <BoringAvatar name={name} variant="beam" size={size} />;
};

export default UserAvatar;
