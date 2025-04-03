"use client";
import { useState, useEffect } from "react";
import { setUser, logout } from "../store/slices/userSlice";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "@/store/store";

const useHomePage = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          email: session?.user?.email ?? "",
          fullName: session?.user?.fullName ?? "",
          userName: session?.user?.userName ?? "",
          password: "",
        })
      );
    }
  }, [session, dispatch]);

  const handleSignUp = async () => {
    const userData = { email, fullName, userName, password };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const signInResponse = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInResponse?.ok) {
          router.push("/availibilityHours");
        } else {
          alert("Sign-in after signup failed.");
        }
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSignIn = async () => {
    const signInResponse = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInResponse?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    dispatch(logout());
    router.push("/");
  };

  return {
    email,
    setEmail,
    fullName,
    setFullName,
    userName,
    setUserName,
    password,
    setPassword,
    isSignUp,
    setIsSignUp,
    dispatch,
    session,
    status,
    useEffect,
    handleSignUp,
    handleSignIn,
    handleSignOut,
  };
};

export default useHomePage;
