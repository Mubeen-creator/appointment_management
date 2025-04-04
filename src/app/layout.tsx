"use client";

import { Provider } from "react-redux";
import { store, useAppDispatch } from "../store/store";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { setUser } from "../store/slices/userSlice";
import { ToastContainer } from "react-toastify";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/loader/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          email: session.user.email ?? "",
          fullName: session.user.fullName ?? "",
          userName: session.user.userName ?? "",
          password: "",
        })
      );
    }
  }, [session, status, dispatch]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Provider store={store}>
            <SessionSync />
            {isLoading && <Loader />}
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
