"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === "/";
  return (
    <div className="p-2 bg-green-600 text-white capitalize flex items-center gap-4 ">
      {!isRoot && (
        <div>
          <button
            onClick={() => router.back()}
            className="text-white m-1"
            aria-label="Go back"
          >
            <FaArrowLeft className="font-2xl" />
          </button>
          <span className="m-4 text-2xl">{title}</span>
        </div>
      )}
    </div>
  );
}
