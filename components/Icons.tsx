import type { IconName } from "@/lib/types";
import type { ReactNode } from "react";

type IconProps = {
  name: IconName | "search" | "moon";
};

export function Icon({ name }: IconProps) {
  const paths: Record<IconProps["name"], ReactNode> = {
    grid: (
      <>
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
    briefcase: (
      <>
        <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
        <rect x="3" y="6" width="18" height="15" rx="2" />
        <path d="M3 12h18" />
      </>
    ),
    box: (
      <>
        <path d="m21 16-9 5-9-5V8l9-5 9 5Z" />
        <path d="m3.3 7.6 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    search: (
      <>
        <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
      </>
    ),
    moon: <path d="M12 3a6 6 0 0 0 9 7.7A9 9 0 1 1 12 3Z" />
  };

  return (
    <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
