"use client";
import flags from "country-flag-icons/react/3x2";

const DEFAULT_FLAG_SIZE = 18;

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
}: CountryFlagProps): JSX.Element {
  const countryName = flagKey as keyof typeof flags;
  const FlagIcon = flags[countryName];

  return (
    <FlagIcon
      height={Math.floor((size / 3) * 2)}
      style={{
        minWidth: size,
      }}
      width={size}
      {...props}
    />
  );
}
