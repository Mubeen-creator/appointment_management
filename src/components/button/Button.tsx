import React from "react";
import { ButtonProps } from "@/constants/interfaces";

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = "",
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white py-3 px-5 rounded-full text-lg font-medium hover:bg-blue-600 cursor-pointer transition w-40 ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
