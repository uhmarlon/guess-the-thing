"use client";

import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
  children?: React.ReactNode;
}

export function NextAuthProvider({
  children,
}: NextAuthProviderProps): JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
