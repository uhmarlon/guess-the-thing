import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <main className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="p-8 bg-blue-700 rounded-lg">
        <h1 className="text-white text-3xl">Willkommen auf der Seite</h1>
        <p className="text-white">Dies ist eine Beispielseite mit Next.js</p>
      </div>
    </main>
  );
}
