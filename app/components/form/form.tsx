/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

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
      <div className="m-4 bg-red-100 p-4 rounded text-red-700 font-bold">
        No valid table name provided.
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

  return (
    <div className="flex-1 h-[90vh] grid grid-cols-1 flex-col">
      {error && (
        <div className="m-4 bg-red-100 p-4 rounded text-red-700 font-bold">
          {error}
        </div>
      )}

      {loading && <p className="m-4"></p>}

      {!loading && items.length === 0 && (
        <p className="m-4">No checklist items found.</p>
      )}

      <div className="m-4 bg-gray-50 p-4 rounded shadow border-2 border-green-600">
        <ul>
          {items.map((item) => (
            <li key={item.id} className="mb-3">
              <label className="flex items-center gap-3 cursor-pointer ">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleCheck(item.id)}
                  className="w-5 h-5"
                />
                <span className="text-green-600">{item.item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Form;
