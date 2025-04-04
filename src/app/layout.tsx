// src/app/layout.tsx
"use client";

import { Provider } from "react-redux";
import { store, useAppDispatch } from "../store/store";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { setUser } from "../store/slices/userSlice";
import { ToastContainer } from "react-toastify";
import RouteChangeHandler from "@/components/routeChangeHandler/RouteChangeHandler";
import { Suspense } from "react";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Provider store={store}>
            <SessionSync />
            <Suspense fallback={<div>Loading...</div>}>
              <RouteChangeHandler>{children}</RouteChangeHandler>
            </Suspense>
            <ToastContainer position="top-right" autoClose={3000} />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
