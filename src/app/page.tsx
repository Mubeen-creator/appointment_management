"use client";

import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

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
        // Dispatch user data to Redux
        dispatch(
          setUser({
            email,
            fullName,
            userName,
            password,
          })
        );
        router.push("/availibilityHours");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSignIn = async () => {
    const userData = { email, password };

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const user = await response.json();
        // Dispatch user data to Redux
        dispatch(
          setUser({
            email: user.email,
            fullName: user.fullName,
            userName: user.userName,
            password: user.password,
          })
        );
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={184}
          height={44}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold text-center mt-2">
          {isSignUp ? "Sign up" : "Sign in"} with Calendly for <br />
          <span>free</span>
        </h1>
      </div>

      {/* Form Container */}
      <div className="border border-gray-300 px-10 py-8 shadow-md rounded-lg w-full max-w-lg h-aut flex flex-col items-center justify-centero">
        {/* Email Field */}
        <div className="w-full">
          <label className="text-md font-semibold text-black mb-1 block">
            Enter your email to get started.
          </label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Full Name Field */}
        {isSignUp && (
          <div className="w-full mt-4">
            <label className="text-md font-semibold text-black mb-1 block">
              Enter your full name.
            </label>
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        {/* Username Field */}
        {isSignUp && (
          <div className="w-full mt-4">
            <label className="text-md font-semibold text-black mb-1 block">
              Enter your username.
            </label>
            <Input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        )}

        {/* Password Field */}
        <div className="w-full mt-4">
          <label className="text-md font-semibold text-black mb-1 block">
            {isSignUp
              ? "Choose a password with at least 8 characters."
              : "Enter your password."}
          </label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle={true}
          />
        </div>

        {/* Divider (Fixed Width) */}
        <div className="bg-gray-300 w-full max-w-sm h-0.5 my-4 mr-10" />

        {/* Password Guidelines */}
        {isSignUp && (
          <p className="text-red-500 text-sm text-left leading-tight w-full">
            Use a few words, avoid common phrases.
            <br />
            No need for symbols, digits, or uppercase letters.
          </p>
        )}

        {/* Privacy Policy */}
        <p className="text-gray-500 text-sm mt-6 leading-tight w-full text-center">
          By {isSignUp ? "creating" : "signing in to"} a Calendly account, you
          agree to{" "}
          <span className="text-blue-500 font-medium">Calendly's Terms </span>
          and <span className="text-blue-500 font-medium">Privacy Policy</span>.
        </p>

        {/* Submit Button */}
        <Button
          text={isSignUp ? "Sign Up" : "Sign In"}
          className="mt-6 w-[130px]"
          onClick={isSignUp ? handleSignUp : handleSignIn}
        />

        {/* Toggle between Sign-up and Sign-in */}
        <p className="text-gray-500 text-sm mt-4">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            className="text-blue-500 font-medium cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
