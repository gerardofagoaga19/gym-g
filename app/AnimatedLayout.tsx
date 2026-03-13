"use client";

import { usePathname } from "next/navigation";

export default function AnimatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="animate-[fadeIn_0.4s_ease-in-out_forwards]"
    >
      {children}
    </div>
  );
}