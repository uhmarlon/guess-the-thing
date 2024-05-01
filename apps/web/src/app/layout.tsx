import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "../components/nextauthprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Guess The Thing",
    template: "%s | Guess The Thing",
  },
  manifest: "/manifest.json",
  authors: [
    {
      name: "UhMarlon",
      url: "https://uhmarlon.dev/",
    },
  ],
  description: "Guess The Thing a online multiplayer game",
  twitter: {
    card: "summary_large_image",
  },
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-192x192.png" },
    { rel: "icon", url: "icons/icon-192x192.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={`${inter.className} `}>
          <div>{children}</div>
        </body>
      </NextAuthProvider>
    </html>
  );
}
