import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = [];

  // Add blank days for the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-start-${i}`} className="p-1 h-8 w-8"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isToday = new Date().toDateString() === currentDate.toDateString();
    const isSelected = selectedDate?.toDateString() === currentDate.toDateString();

    let dayClasses = "p-1 h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 text-sm";
    
    if (isSelected) {
      dayClasses += " bg-black text-white font-bold";
    } else if (isToday) {
      dayClasses += " bg-slate-200 text-black font-bold";
    } else {
      dayClasses += " text-slate-800 hover:bg-slate-100";
    }

    calendarDays.push(
      <div key={day} className={dayClasses} onClick={() => onSelectDate(currentDate)}>
        {day}
      </div>
    );
  }

  const handlePrevMonth = () => {
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(year, month + 1, 1));
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setDisplayDate(new Date(newYear, month, 1));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);


  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-72">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-black">
            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-800">{monthNames[month]}</span>
            <select
              value={year}
              onChange={handleYearChange}
              className="font-bold text-base text-slate-800 bg-white border border-slate-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-black"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-black">
            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day, index) => <div key={index} className="font-bold text-xs text-slate-500">{day}</div>)}
        {calendarDays}
      </div>
    </div>
  );
};

export default Calendar;