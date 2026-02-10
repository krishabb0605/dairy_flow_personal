'use client';

import { useState } from 'react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DeliveryCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const today = new Date();

  const changeMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const jumpTo = (y: number, m: number) => {
    setCurrentDate(new Date(y, m, 1));
  };

  const cells = [];

  /** Previous month fillers */
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      disabled: true,
    });
  }

  /** Current month */
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      disabled: false,
    });
  }

  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-auto'>
      {/* HEADER */}
      <div className='px-6 py-5 border-b border-slate-200 flex justify-between items-center'>
        <div className='flex gap-4'>
          <div>
            <h2 className='text-lg font-bold'>Delivery Calendar</h2>
            <p className='text-sm text-slate-500'>
              Track and manage your daily milk supply
            </p>
          </div>
          <select
            className='border rounded px-2 py-1 text-sm'
            value={month}
            onChange={(e) => jumpTo(year, Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            className='border rounded px-2 py-1 text-sm'
            value={year}
            onChange={(e) => jumpTo(Number(e.target.value), month)}
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const y = today.getFullYear() - 5 + i;
              return <option key={y}>{y}</option>;
            })}
          </select>
        </div>

        <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-xl'>
          <button
            onClick={() => changeMonth(-1)}
            className='p-2 hover:bg-white rounded-lg'
          >
            <span className='material-symbols-outlined'>chevron_left</span>
          </button>

          <span className='px-3 font-bold text-sm'>
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>

          <button
            onClick={() => changeMonth(1)}
            className='p-2 hover:bg-white rounded-lg'
          >
            <span className='material-symbols-outlined'>chevron_right</span>
          </button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className='grid grid-cols-7 px-6 pt-4'>
        {weekDays.map((d) => (
          <div
            key={d}
            className='text-center text-md font-bold text-slate-400 py-2'
          >
            {d.toLocaleUpperCase()}
          </div>
        ))}
      </div>

      {/* DAYS */}
      <div className='p-6'>
        <div className='grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden'>
          {cells.map((d, i) => {
            const isToday =
              !d.disabled &&
              d.day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={i}
                className={`aspect-square p-3 cursor-pointer transition
                ${d.disabled ? 'bg-slate-50 opacity-40' : 'bg-white hover:bg-slate-100'}
                ${isToday && 'border-2 border-primary bg-primary/10'}`}
              >
                <span className='text-sm font-bold'>{d.day}</span>

                {!d.disabled && (
                  <div className='flex flex-col items-center justify-center h-full -mt-4'>
                    <div className='text-xs font-bold text-slate-400 uppercase'>
                      1.5L
                    </div>

                    <div className='size-1.5 bg-primary rounded-full mt-1'></div>
                  </div>
                )}

                {isToday && (
                  <span className='absolute top-1 right-1 text-[8px] bg-primary text-white px-1 rounded'>
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
