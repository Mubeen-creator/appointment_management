"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";

export default function RouteChangeHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    window.addEventListener("routeChangeStart", handleRouteChangeStart);
    window.addEventListener("routeChangeComplete", handleRouteChangeComplete);
    window.addEventListener("routeChangeError", handleRouteChangeComplete);

    handleRouteChangeStart();
    timeout = setTimeout(() => setIsLoading(false), 500);

    return () => {
      window.removeEventListener("routeChangeStart", handleRouteChangeStart);
      window.removeEventListener(
        "routeChangeComplete",
        handleRouteChangeComplete
      );
      window.removeEventListener("routeChangeError", handleRouteChangeComplete);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  );
}
