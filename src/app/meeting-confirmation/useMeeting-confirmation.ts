"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
const useConfirmation = () => {
  const appointment = useSelector((state: RootState) => state.appointment);
  const router = useRouter();
  const [countdown, setCountdown] = useState(3); // Countdown timer (in seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      router.push("/dashboard"); // Redirect to dashboard
    }

    return () => clearInterval(timer);
  }, [countdown, router]);

  return {
    appointment,
    router,
    countdown,
    setCountdown,
    useEffect,
  };
};

export default useConfirmation;
