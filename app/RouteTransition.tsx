"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ${
        loading ? "opacity-0 scale-[0.98] blur-sm" : "opacity-100 scale-100 blur-0"
      }`}
    >
      {children}
    </div>
  );
}
