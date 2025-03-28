import React, { useState } from "react";
import { PiEyeSlashBold, PiEyeBold } from "react-icons/pi";

interface InputProps {
  type?: "text" | "password" | "email";
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  showPasswordToggle?: boolean; // Prop to control eye icon visibility
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  showPasswordToggle = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type={showPasswordToggle && isPasswordVisible ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border border-gray-400 px-3 py-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-700 ${className}`}
      />
      {/* Show Eye Icon Only for Password Fields */}
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <PiEyeSlashBold size={20} />
          ) : (
            <PiEyeBold size={20} />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
