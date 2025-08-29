import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Helper to format date as YYYY-MM-DD for the form state
const formatDateForInput = (date: Date): string => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

// Helper to format YYYY-MM-DD date string for display (DD-MM-YYYY)
const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Return as-is if not in expected format
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
};

// Helper to safely parse YYYY-MM-DD string into a local Date object
const parseAsLocalDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    if (year && month && day) {
        // year, month (0-indexed), day
        return new Date(year, month - 1, day);
    }
    return null;
}

const Input: React.FC<InputProps> = ({ label, name, type, value, onChange, disabled, ...props }) => {
  if (type === 'date') {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [displayValue, setDisplayValue] = useState(formatDateForDisplay(value as string));

    // Sync display value when the prop value changes from the form state
    useEffect(() => {
        setDisplayValue(formatDateForDisplay(value as string));
    }, [value]);
    
    // Effect to handle clicks outside the datepicker to close the calendar
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
          setIsCalendarOpen(false);
        }
      };
      if (isCalendarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isCalendarOpen]);

    // Propagate changes to the parent formik state
    const sendChangeToParent = (date: Date | null) => {
        if (onChange) {
            const formattedDate = date ? formatDateForInput(date) : '';
            const syntheticEvent = {
                target: { name: name!, value: formattedDate }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };
    
    // Handle date selection from the calendar component
    const handleDateSelect = (date: Date) => {
      sendChangeToParent(date);
      setIsCalendarOpen(false);
    };

    // Handle manual input change
    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
    };

    // Validate and format the date on blur
    const handleBlur = () => {
        const parts = displayValue.split(/[-/.]/);
        if (parts.length === 3) {
            const [day, month, year] = parts.map(p => parseInt(p, 10));
            // Basic validation
            if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900 && year < 2100) {
                const date = new Date(year, month - 1, day);
                 // Final check to ensure date is valid (e.g., handles Feb 30)
                if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                    sendChangeToParent(date);
                    return;
                }
            }
        }
        
        // If date is invalid or empty, clear the parent state if the current value is not already empty
        if (value) {
            sendChangeToParent(null);
        }
    };

    return (
      <div className="flex flex-col" ref={datePickerRef}>
        <label htmlFor={name} className="mb-2 font-bold text-slate-800">{label}</label>
        <div className="relative">
          <input
            id={name}
            name={name}
            type="text"
            className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 pr-10`}
            value={displayValue}
            onChange={handleManualChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder="dd-mm-yyyy"
            {...props}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            aria-label="Toggle calendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          
          {isCalendarOpen && !disabled && (
            <div className="absolute z-10 mt-1">
              <Calendar
                selectedDate={parseAsLocalDate(value as string)}
                onSelectDate={handleDateSelect}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback for other input types
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-bold text-slate-800">{label}</label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
