import flags from 'country-flag-icons/react/3x2';
const DEFAULT_FLAG_SIZE = 18;

const SPECIAL_ZONE_NAMES = {
  AUS: 'AU',
} as { [index: string]: string };


type HTMLSVGElement = HTMLElement & SVGElement;
interface CountryFlagProps
  extends React.HTMLAttributes<HTMLSVGElement>,
    React.SVGAttributes<HTMLSVGElement> {
    flagKey: string;
    size?: number;
}

export function CountryFlag({
  flagKey,
  size = DEFAULT_FLAG_SIZE,
  ...props
}: CountryFlagProps) {
  const countryName = flagKey as keyof typeof flags;
  const FlagIcon = flags[countryName];

  if (!FlagIcon) {
    return <span className={`text-[14px]`}>🏴‍☠️</span>;
  }
  return (
    <FlagIcon
      width={size}
      height={Math.floor((size / 3) * 2)}
      style={{
        minWidth: size,
      }}
      {...props}
    />
  );
}