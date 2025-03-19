import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white py-3 px-5 rounded-full text-lg font-medium hover:bg-blue-600 cursor-pointer transition w-40 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
