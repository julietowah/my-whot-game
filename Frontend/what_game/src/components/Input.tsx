import React from "react";

interface ReusableInputProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Optional className for additional styling
}

const ReusableInput: React.FC<ReusableInputProps> = ({
  value,
  placeholder,
  onChange,
  className,
}) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
};

export default ReusableInput;
