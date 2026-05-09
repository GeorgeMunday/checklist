/* eslint-disable @next/next/no-img-element */
import React from "react";
import cities from "@/data/cities.json";
import Header from "../../components/header/header";

export default async function PlacesPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.name);

  const cityIndex = cities.findIndex(
    (c) => c.name.toLowerCase().replace(/\s+/g, "_") === decodedName,
  );
  const city = cityIndex !== -1 ? cities[cityIndex] : null;

  if (!city) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header title="City Not Found" />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-extrabold text-black mb-4">
            City Not Found
          </h1>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header title={`${city.name} - Places`} />
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {city.mainImage && (
            <div className="w-full h-64 sm:h-80 mb-8 rounded-3xl overflow-hidden relative shadow-sm border border-gray-200">
              <img
                src={city.mainImage}
                alt={city.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-4 tracking-tight">
            Places to visit in {city.name}
          </h1>
          <div className="mb-8">
            <p className="text-gray-500 font-bold text-lg">
              Stop {cityIndex + 1}
            </p>
            <p className="text-gray-400 font-medium text-md mt-1">
              Arrive: {city.arrive} ({city.arriveDate}) - Leave: {city.leave} (
              {city.leaveDate})
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.extraInfo?.map((place, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
              >
                {place.image && (
                  <div className="w-full h-48 relative border-b border-gray-100">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-extrabold text-black mb-2">
                    {place.name}
                  </h2>
                  <p className="text-black font-medium mb-4">
                    Location: {place.location}
                  </p>
                  {place.info && (
                    <div>
                      <p className="text-black text-sm">{place.info}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
