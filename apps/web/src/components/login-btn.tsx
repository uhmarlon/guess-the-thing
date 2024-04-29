"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn(): JSX.Element {
  const { data: session } = useSession();
  return (
    <>
      {session?.user ? (
        <>
          Signed in as {session.user.name} <br />
          <button type="button" onClick={(): unknown => signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button type="button" onClick={(): unknown => signIn()}>
            Sign in
          </button>
        </>
      )}
    </>
  );
}
