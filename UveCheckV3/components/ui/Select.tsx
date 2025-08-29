import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (string | { label: string, value: string })[];
}

const Select: React.FC<SelectProps> = ({ label, name, options, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-bold text-gray-700">{label}</label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-10"
          {...props}
        >
          {props.required && <option value="" disabled>Select an option</option>}
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const displayLabel = typeof option === 'string' ? option : option.label;
            return <option key={value} value={value}>{displayLabel}</option>;
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default Select;
