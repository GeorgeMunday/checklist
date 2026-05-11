"use client";

import Link from "next/link";
import Header from "./components/header/header";
import { useState } from "react";
import { motion } from "framer-motion";
import cities from "@/data/cities";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

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
                    <p className="text-gray-400 font-medium text-sm mt-1">
                      Arrive: {city.arrive} ({city.arriveDate}) - Leave:{" "}
                      {city.leave} ({city.leaveDate})
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/places/${city.name.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        <span className="inline-block bg-black text-white px-4 py-2 rounded-lg mr-2 font-bold text-sm hover:bg-gray-800 transition-colors">
                          More info
                        </span>
                      </Link>
                      <Link
                        href={`/city/${city.name.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        <span className="inline-block bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors">
                          Checklist
                        </span>
                      </Link>
                    </div>
                    <div className="mt-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
