import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { GrLink } from "react-icons/gr";
import { MdKeyboardArrowDown } from "react-icons/md";

const useHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document?.addEventListener("mousedown", handleClickOutside);
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    router,
  };
};

export default useHeader;
