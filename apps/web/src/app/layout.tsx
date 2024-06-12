import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "../components/nextauthprovider";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#5041AB",
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Guess The Thing - Fun Online Multiplayer Trivia Games",
    template: "%s | Guess The Thing",
  },
  manifest: "/manifest.json",
  authors: [
    {
      name: "UhMarlon",
      url: "https://uhmarlon.dev/",
    },
  ],
  description:
    "Play Guess The Thing - the ultimate online multiplayer trivia game. Test your knowledge with games like Guess the Drink, Guess the Price, and Guess the Flag.",
  twitter: {
    card: "summary_large_image",
  },
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-192x192.png" },
    { rel: "icon", url: "icons/icon-192x192.png" },
  ],
  openGraph: {
    type: "website",
    url: "https://guessthething.io/",
    title: "Guess The Thing - Fun Online Multiplayer Trivia Games",
    description:
      "Join the fun with Guess The Thing, featuring games like Guess the Drink, Guess the Price, and Guess the Flag. More games coming soon!",
    images: [
      {
        url: "https://guessthething.io/og-image.png",
        width: 800,
        height: 600,
        alt: "Guess The Thing Logo",
      },
    ],
  },
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
