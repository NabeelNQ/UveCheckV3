import React from 'react';

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, value, onChange, options, disabled = false }) => {
  return (
    <fieldset disabled={disabled}>
      <legend className={`mb-2 font-bold text-slate-800 ${disabled ? 'text-gray-500' : ''}`}>{label}</legend>
      <div className="flex items-center space-x-6 pt-1">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className="custom-radio"
            />
            <label htmlFor={`${name}-${option.value}`} className={`ml-2 block ${disabled ? 'text-gray-500' : 'text-slate-800'}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroup;