/* eslint-disable @next/next/no-img-element */
import React from "react";
import cities from "@/data/cities";
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
          <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-4 tracking-tight">
            Places to visit in {city.name}
          </h1>
          <div className="mb-8">
            <p className="text-gray-500 font-bold text-lg">
              Stop {cityIndex + 1}
            </p>
            <p className="text-gray-400 font-medium text-md mt-1">
              Arrive: {city.arrive}{" "}
              {city.arriveDate ? `(${city.arriveDate})` : ""} - Leave:{" "}
              {city.leave} {city.leaveDate ? `(${city.leaveDate})` : ""}
            </p>
            {city.stayingAt && (
              <p className="text-gray-400 font-medium text-md mt-1">
                Staying at:{" "}
                {city.stayingAt.startsWith("http") ? (
                  <a
                    href={city.stayingAt}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Link
                  </a>
                ) : (
                  city.stayingAt
                )}
              </p>
            )}
            {city.doing && (
              <p className="text-gray-400 font-medium text-md mt-1">
                Doing:{" "}
                {city.doing.match(/https?:\/\/[^\s]+/) ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: city.doing.replace(
                        /(https?:\/\/[^\s]+)/g,
                        '<a href="$1" target="_blank" rel="noreferrer" class="text-blue-500 hover:underline">Link</a>',
                      ),
                    }}
                  />
                ) : (
                  city.doing
                )}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
