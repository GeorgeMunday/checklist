"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === "/";
  return (
    <div className="p-10 bg-green-600 text-white capitalize flex items-center gap-4 ">
      {!isRoot && (
        <button
          onClick={() => router.back()}
          className="text-white"
          aria-label="Go back"
        >
          <FaArrowLeft className="font-2xl" />
        </button>
      )}
      <span>{title}</span>
    </div>
  );
}
