import React from 'react';

interface ToggleButtonGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: { label: string; value: string }[];
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ label, name, value, onChange, options }) => {
  const handleClick = (optionValue: string) => {
    // Mimic event object structure for the form handler
    onChange({ target: { name, value: optionValue } });
  };

  return (
    <div>
      <p className="mb-2 font-bold text-gray-700">{label}</p>
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleClick(option.value)}
            className={`w-full px-4 py-3 rounded-lg font-bold border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              value === option.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-slate-300 hover:bg-slate-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButtonGroup;
