/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ChecklistItem = {
  id: number;
  item: string;
  completed: boolean;
};

async function readJsonSafely<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function getList(tableName: string): Promise<ChecklistItem[]> {
  const res = await fetch(`/api/getList/${encodeURIComponent(tableName)}`);

  const data = await readJsonSafely<ChecklistItem[] | { error?: string }>(res);

  if (!res.ok) {
    throw new Error(
      (data && "error" in data && data.error) || "Failed to fetch checklist",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid checklist response");
  }

  return data;
}

type FormProps = {
  tableName: string;
};

const Form = ({ tableName }: FormProps) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isValidTable = tableName && tableName !== "undefined";

  useEffect(() => {
    if (!isValidTable) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await getList(tableName);

        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch checklist");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tableName, isValidTable]);

  if (!isValidTable) {
    return (
      <div className="flex items-center justify-center flex-1 bg-white px-4">
        <div className="bg-red-50 border border-red-500 p-4 sm:p-6 rounded-xl text-red-600 font-bold text-center shadow-sm">
          No valid table name provided.
        </div>
      </div>
    );
  }

  async function handleCheck(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
    try {
      const res = await fetch("/api/checkItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableName, id }),
      });
      if (!res.ok) {
        const data = await readJsonSafely<{ error?: string }>(res);
        throw new Error(data?.error || "Failed to update item");
      }

      const updated = await readJsonSafely<Partial<ChecklistItem>>(res);
      if (!updated) {
        throw new Error("Invalid update response");
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      );
    } catch (err: any) {
      setError(err.message || "Failed to update item");
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      );
    }
  }

  const completedCount = items.filter((item) => item.completed).length;
  const completionPercentage =
    items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col bg-white px-4 py-6 sm:p-6">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-500 p-3 sm:p-4 rounded-lg text-red-600 text-sm sm:text-base font-bold flex items-start sm:items-center gap-2">
          <span className="flex-shrink-0 text-lg">Error:</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-6 border-black"></div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-base sm:text-lg text-center font-medium">
            No checklist items found.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="flex-1 flex flex-col w-full">
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3 gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-black">
                Checklist
              </h2>
              <span className="text-xs sm:text-sm font-bold text-black bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                {completedCount}/{items.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
              <div
                className="bg-black h-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4 sm:p-6 rounded-xl shadow-sm overflow-y-auto flex-1">
            <ul className="space-y-2 sm:space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <motion.label
                    whileTap={{
                      scale: 0.96,
                      backgroundColor: "#f9fafb",
                      borderColor: "#16a34a",
                    }}
                    className="flex items-center gap-3 sm:gap-4 cursor-pointer p-3 sm:p-4 rounded-lg border border-transparent transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed || false}
                      value={item.id}
                      onChange={() => handleCheck(item.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer accent-black rounded "
                    />
                    <span
                      className={`flex-1 text-base sm:text-lg min-w-0 font-medium ${
                        item.completed
                          ? "text-gray-400 line-through"
                          : "text-black"
                      }`}
                    >
                      {item.item}
                    </span>
                    {item.completed && (
                      <span className="text-black text-lg sm:text-xl font-bold ">
                        Done
                      </span>
                    )}
                  </motion.label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
