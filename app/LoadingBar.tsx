"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120,
  minimum: 0.2,
  easing: "ease",
  speed: 400,
});

export default function LoadingBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, [pathname]);

  return null;
}