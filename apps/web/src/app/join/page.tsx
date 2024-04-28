export default function Page(): JSX.Element {
  return (
    <main className="mt-6 md:mt-12">
      <div className="z-20 flex w-full flex-col">
        <span className="mx-auto mb-6 rounded-full border border-white/20 bg-white/10 px-9 py-2 text-center font-medium text-white backdrop-blur-sm">
          Multiplayer and single-player guess games
        </span>
        <h1 className="text-4xl font-bold text-center mb-2">Guess The Thing</h1>
        <span className="text-1xl text-center mb-2">
          Challenge your friends or test your skills solo.
        </span>
      </div>
    </main>
  );
}
