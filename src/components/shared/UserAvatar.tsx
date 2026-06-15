import BoringAvatar from "boring-avatars";

const UserAvatar = ({
  name,
  seed,
  size = 32,
}: {
  /** Accessible label kept for call-site semantics; BoringAvatar renders from the seed. */
  alt?: string;
  name: string;
  /** Overrides the avatar seed without changing the displayed name (used to reshuffle). */
  seed?: string;
  size?: number;
}) => {
  return <BoringAvatar name={seed ?? name} variant="beam" size={size} />;
};

export default UserAvatar;
