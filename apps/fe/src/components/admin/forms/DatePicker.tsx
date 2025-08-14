import React, { useState, useRef, useEffect } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/20/solid';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  className = '',
  label,
  required = false,
  error,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const selectedDate = value ? new Date(value) : null;
  const formattedValue = selectedDate
    ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`
    : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const isoString = date.toISOString().split('T')[0];
    onChange(isoString);
    setIsOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${className} ${error ? 'border-red-300' : ''}`}
      >
        <span className={formattedValue ? 'text-gray-900' : 'text-gray-500'}>
          {formattedValue || placeholder}
        </span>
        <CalendarDaysIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </button>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleMonthChange('prev')}
                className="rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <h3 className="text-sm font-semibold text-gray-900">
                {months[currentMonth]} {currentYear}
              </h3>

              <button
                type="button"
                onClick={() => handleMonthChange('next')}
                className="rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Days of week header */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-1 text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={day === null}
                  onClick={() => day && handleDateSelect(day)}
                  className={`h-8 w-8 rounded-md text-sm transition-colors ${day === null ? 'invisible' : ''} ${
                    isSelected(day || 0)
                      ? 'bg-indigo-600 text-white'
                      : isToday(day || 0)
                        ? 'bg-indigo-100 font-medium text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex justify-between border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const isoString = today.toISOString().split('T')[0];
                  onChange(isoString);
                  setIsOpen(false);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Hôm nay
              </button>

              {formattedValue && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
