import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/header";

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
      <body className={`${inter.className} `}>
        <Header />
        <div className="text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-black to-[#001429] min-h-screen">
          <div className="w-[80%] md:w-[65rem]">{children}</div>
        </div>
      </body>
    </html>
  );
}
