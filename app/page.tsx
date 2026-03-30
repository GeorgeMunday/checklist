import Link from "next/link";
import Header from "./components/header/header";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header title="Trip Checklist" />
      <main className="flex-1 grid grid-cols-2 p-4 gap-2 text-xs">
        <Link href="/city/london">
          <button className="w-full text-white h-full text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            1. London St Pancras
          </button>
        </Link>
        <Link href="/city/amsterdam">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            2. Amsterdam
          </button>
        </Link>
        <Link href="/city/berlin">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            3. Berlin
          </button>
        </Link>
        <Link href="/city/prague">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            4. Prague
          </button>
        </Link>
        <Link href="/city/krakow">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            5. Krakow
          </button>
        </Link>
        <Link href="/city/budapest">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            6. Budapest
          </button>
        </Link>
        <Link href="/city/ljubljana">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            7. Ljubljana
          </button>
        </Link>
        <Link href="/city/split">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            8. Split
          </button>
        </Link>
        <Link href="/city/overnight_ferry">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            9. Overnight Ferry
          </button>
        </Link>
        <Link href="/city/rome">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            10. Rome
          </button>
        </Link>
        <Link href="/city/florence">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            11. Florence
          </button>
        </Link>
        <Link href="/city/nice">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            12. Nice
          </button>
        </Link>
        <Link href="/city/paris">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            13. Paris
          </button>
        </Link>
        <Link href="/city/london">
          <button className="w-full h-full text-white text-center bg-green-600 rounded font-bold hover:bg-green-400 transition-colors">
            14. London St Pancras
          </button>
        </Link>
      </main>
    </div>
  );
}
