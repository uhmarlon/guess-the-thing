import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-black to-[#001429] min-h-screen">
        <div className="w-[80%] md:w-[65rem]">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
