"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn(): JSX.Element {
  const { data: session } = useSession();
  return (
    <>
      {session?.user ? (
        <>
          Signed in as {session.user.name} <br />
          <button onClick={(): unknown => signOut()} type="button">
            Sign out
          </button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={(): unknown => signIn()} type="button">
            Sign in
          </button>
        </>
      )}
    </>
  );
}
