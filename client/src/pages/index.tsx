import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Guess The Thing</title>
        <meta
          name="description"
          content="Guess The Thing a online multiplayer game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-6 md:mt-12">
        <div className="z-20 flex w-full flex-col">
          <span className="mx-auto mb-6 rounded-full border border-white/20 bg-white/10 px-9 py-2 text-center font-medium text-white backdrop-blur-sm">
            Multiplayer and single-player guess games
          </span>
          <h1 className="text-4xl font-bold text-center mb-2">
            Guess The Thing
          </h1>
          <span className="text-1xl text-center mb-2">
            Challenge your friends or test your skills solo.
          </span>

          <div className="grid grid-cols-1 gap-1 m-4 justify-center items-center content-center justify-items-center">
            <div className="relative w-[20rem] md:w-1/2 h-[15rem] mb-3">
              <Link href="/gussthecocktail">
                <Image
                  src="https://www.thecocktaildb.com/images/media/drink/nkwr4c1606770558.jpg"
                  alt=""
                  fill
                  className="rounded-xl layout-fill object-cover"
                />
                <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent rounded-xl"></div>
                <div className="absolute bottom-0 w-full h-full flex flex-col justify-end px-6 pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Guess The Cocktail
                  </h3>
                  <p className="text-white/80">Guess the Cocktail of a Image</p>
                </div>
              </Link>
            </div>

            <div className="relative w-[20rem] md:w-1/2 h-[15rem] mb-3">
              <Link href="/gusstheflag">
                <Image
                  src="/flag.webp"
                  alt=""
                  fill
                  className="rounded-xl layout-fill object-cover"
                />
                <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent rounded-xl"></div>
                <div className="absolute bottom-0 w-full h-full flex flex-col justify-end px-6 pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Guess The Flag
                  </h3>
                  <p className="text-white/80">Guess the flag of a country.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
