"use client";

import Link from "next/link";
import Header from "./components/header/header";
import { useState } from "react";
import { motion } from "framer-motion";

const cities = [
  { name: "London St Pancras" },
  { name: "Amsterdam" },
  { name: "Berlin" },
  { name: "Prague" },
  { name: "Krakow" },
  { name: "Budapest" },
  { name: "Ljubljana" },
  { name: "Split" },
  { name: "Overnight Ferry" },
  { name: "Rome" },
  { name: "Florence" },
  { name: "Nice" },
  { name: "Paris" },
  { name: "London St Pancras" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header title="Trip Checklist" />
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-3 tracking-tight">
              European Adventure
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium">
              Track your journey across 14 destinations
            </p>
          </div>

          <div className="relative mb-12 max-w-xl mx-auto sm:mx-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-200 shadow-sm bg-white text-black placeholder-gray-400 rounded-2xl focus:border-green-600 focus:ring-0 focus:outline-none transition-all duration-300 font-medium text-base sm:text-lg"
            />
          </div>

          <div className="mb-14">
            <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-black inline-block rounded-sm"></span>
              Destinations
            </h2>
            {filteredCities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 font-medium">
                  No destinations found matching &quot;{searchQuery}&quot;
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCities.map((city, idx) => (
                  <Link
                    key={idx}
                    href={`/city/${city.name.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full h-28 sm:h-36 rounded-2xl font-bold bg-white text-black border border-gray-200 shadow-sm flex flex-col items-center justify-center overflow-hidden relative"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-1 relative z-10 px-4 w-full">
                        <span className="text-base sm:text-lg font-extrabold leading-tight text-center line-clamp-2 uppercase tracking-wide">
                          {city.name}
                        </span>
                      </div>
                    </motion.button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-black inline-block rounded-sm"></span>
              Route Itinerary
            </h2>
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-6 border-l-4 border-gray-200 ml-2 pl-6 sm:pl-8 relative">
                {cities.map((city, i) => (
                  <div key={i} className="relative">
                    <div
                      className={`absolute -left-7.75 sm:-left-10 top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-white bg-black`}
                    />
                    <p className="font-extrabold text-lg sm:text-xl text-black">
                      {city.name}
                    </p>
                    <p className="text-gray-500 font-bold text-sm mt-0.5">
                      Stop {i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 mb-8">
            <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-black inline-block rounded-sm"></span>
              Places to Visit
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {cities.map((city, i) => (
                <Link
                  key={i}
                  href={`/places/${city.name.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm transition-colors cursor-pointer h-full flex items-center justify-center text-center">
                    <h3 className="text-lg sm:text-xl font-extrabold text-black mb-0">
                      {city.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
