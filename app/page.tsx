"use client";

import Link from "next/link";
import Header from "./components/header/header";
import { useState, useEffect } from "react";
import cities from "@/data/cities";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const secret = process.env.NEXT_PUBLIC_PASSWORD;
  const [imhere, setImhere] = useState("");

  useEffect(() => {
    const fetchImHere = async () => {
      try {
        const res = await fetch("/api/ImHere/fetch");
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          setImhere(data[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch imhere:", err);
      }
    };
    fetchImHere();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (secret && val === secret) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleImHereClick = async (cityName: string) => {
  if (!isAuthenticated) return;
  try {
    const res = await fetch("/api/ImHere/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityName }),
    });
    if (!res.ok) throw new Error("Update failed");
    setImhere(cityName);
  } catch (err) {
    console.error("Failed to update imhere:", err);
  }
};

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header title="Trip Checklist" />
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-3 tracking-tight">
              European Adventure
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium mb-3">
              Track your journey across 14 destinations
            </p>
            <p className="text-base sm:text-lg text-gray-500 font-medium mb-3">
              Enter the password to unlock detailed itineraries and checklists for each city and edit where you are.
            </p>
            <p className="text-base sm:text-lg text-gray-500 font-medium">
              I am currently in: {imhere ? imhere : "England"}
            </p>
          </div>

          <input
            type="password"
            placeholder="Enter Password"
            className="bg-white border border-gray-300 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:border-0 block w-full p-2.5 mb-7"
            onChange={handlePasswordChange}
          />

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
                      className={`absolute -left-7.75 sm:-left-10 top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-white ${imhere === city.name ? "bg-green-500" : "bg-black"}`}
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
                        href={isAuthenticated ? `/city/${city.name.toLowerCase().replace(/\s+/g, "_")}` : "#"}
                      >
                        <span className={`inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors mr-2 ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}>
                          More info
                        </span>
                      </Link>
                      <Link
                        href={isAuthenticated ? `/city/${city.name.toLowerCase().replace(/\s+/g, "_")}` : "#"}
                      >
                        <span className={`inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors mr-2 ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}>
                          Checklist
                        </span>
                      </Link>
                      <span
                        className={`inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isAuthenticated ? "hover:bg-gray-300 cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                        onClick={() => handleImHereClick(city.name)}
                      >
                        I Am Here
                      </span>
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