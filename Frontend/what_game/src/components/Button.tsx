import React from "react";

interface ReusableButtonProps {
  onClick: () => void;
  label: string;
  className?: string; // Optional className for additional styling
}

const Button: React.FC<ReusableButtonProps> = ({
  onClick,
  label,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
