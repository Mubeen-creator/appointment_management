"use client";
import { useEffect, useState } from "react";
import { RootState, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
const useConfirmation = () => {
  const appointment = useAppSelector((state: RootState) => state?.appointment);
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      router.push("/dashboard");
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
