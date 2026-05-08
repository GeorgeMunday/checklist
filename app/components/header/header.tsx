"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === "/";
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between sticky top-0 z-50">
      {!isRoot && (
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => router.back()}
            className="text-black bg-gray-100 p-2.5 rounded-xl flex-shrink-0 transition-colors duration-150"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-base sm:text-lg" />
          </motion.button>
          <span className="text-xl sm:text-2xl font-extrabold text-black capitalize tracking-tight truncate">
            {title}
          </span>
        </div>
      )}
      {isRoot && (
        <h1 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 bg-black rounded-full inline-block"></span>
          Trip Checklist
        </h1>
      )}
    </div>
  );
}
