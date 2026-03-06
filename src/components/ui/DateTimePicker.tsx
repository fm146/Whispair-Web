"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({ name, required, placeholder, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const defaultClassName = "w-full bg-deep border border-border rounded-xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white cursor-pointer text-sm font-bold uppercase tracking-widest";

  // Format to ISO string for form submission
  const hiddenValue = selectedDate ? selectedDate.toISOString() : "";

  return (
    <div className="relative w-full">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={hiddenValue} required={required} />

      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="dd/MM/yyyy HH:mm"
        placeholderText={placeholder || "DD/MM/YYYY HH:MM"}
        className={className || defaultClassName}
        wrapperClassName="w-full"
        calendarClassName="whispair-calendar"
        popperClassName="whispair-popper"
        showPopperArrow={false}
        popperPlacement="bottom-start"
      />

      {/* Calendar icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}
