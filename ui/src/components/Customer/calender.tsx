'use client';

import { useState } from 'react';
import Modal from '../modal';
import { type DeliveryCalendarProps } from '../../types';
import Button from '../../components/ui/button';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DeliveryCalendar({
  customerSetting,
}: DeliveryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const today = new Date();

  const changeMonth = (dir: number) => {
    const nextDate = new Date(year, month + dir, 1);
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    if (nextDate > currentMonthStart) return;
    setCurrentDate(nextDate);
  };

  const jumpTo = (y: number, m: number) => {
    if (y > today.getFullYear()) return;
    if (y === today.getFullYear() && m > today.getMonth()) return;
    setCurrentDate(new Date(y, m, 1));
  };

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNextMonth = new Date(year, month + 1, 1) <= todayMonthStart;

  const deliveryData = {
    morningCow: Number(customerSetting?.morningCowQty) ?? 0,
    morningBuffalo: Number(customerSetting?.morningBuffaloQty) ?? 0,
    eveningCow: Number(customerSetting?.eveningCowQty) ?? 0,
    eveningBuffalo: Number(customerSetting?.eveningBuffaloQty) ?? 0,
  };

  const totalMorning = deliveryData.morningCow + deliveryData.morningBuffalo;
  const totalEvening = deliveryData.eveningCow + deliveryData.eveningBuffalo;
  const totalDay = totalMorning + totalEvening;

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
      <div className='px-6 py-5 border-b border-slate-200 flex justify-between items-center gap-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div>
            <h2 className='text-lg font-bold'>Delivery Calendar</h2>
            <p className='text-sm text-slate-500'>
              Track and manage your daily milk supply
            </p>
          </div>
          <div className='flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/80'>
            <div className='relative'>
              <select
                className='appearance-none h-10 min-w-36 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
                value={month}
                onChange={(e) => jumpTo(year, Number(e.target.value))}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option
                    key={i}
                    value={i}
                    disabled={
                      year === today.getFullYear() && i > today.getMonth()
                    }
                  >
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}
                  </option>
                ))}
              </select>
              <span className='material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-primary'>
                expand_more
              </span>
            </div>

            <div className='relative'>
              <select
                className='appearance-none h-10 min-w-24 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
                value={year}
                onChange={(e) => jumpTo(Number(e.target.value), month)}
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const y = today.getFullYear() - 9 + i;
                  return <option key={y}>{y}</option>;
                })}
              </select>
              <span className='material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-primary'>
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-xl'>
          <Button
            onClick={() => changeMonth(-1)}
            variant='ghost-list'
            className='p-2 rounded-lg'
          >
            <span className='material-symbols-outlined'>chevron_left</span>
          </Button>

          <span className='px-3 font-bold text-sm'>
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>

          <Button
            disabled={!canGoNextMonth}
            onClick={() => changeMonth(1)}
            variant='ghost-list'
            className={`p-2 rounded-lg ${
              canGoNextMonth
                ? ''
                : 'opacity-40 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span className='material-symbols-outlined'>chevron_right</span>
          </Button>
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
      <div className='p-6 pt-0'>
        <div className='grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden'>
          {cells.map((d, i) => {
            const isToday =
              !d.disabled &&
              d.day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const cellDate = new Date(year, month, d.day);
            const isFuture = !d.disabled && cellDate > endOfToday;
            const canOpenDay = !d.disabled && !isFuture;

            return (
              <div
                key={i}
                onClick={() => {
                  if (!canOpenDay) return;
                  setSelectedDate(cellDate);
                }}
                className={`aspect-square p-3 cursor-pointer transition relative
                ${
                  d.disabled
                    ? 'bg-slate-50 opacity-40'
                    : isFuture
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-slate-100'
                }
                ${isToday && 'border-2 border-primary bg-primary/10'}`}
              >
                <span className='text-sm font-bold'>{d.day}</span>

                {!d.disabled && !isFuture && (
                  <div className='flex flex-col items-center justify-center h-full -mt-4'>
                    <div className='text-xs font-bold text-slate-400 uppercase'>
                      {totalDay}L
                    </div>

                    <div className='size-1.5 rounded-full mt-1 bg-primary'></div>
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

      <Modal
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        cancelText='Close'
        title={
          selectedDate
            ? selectedDate.toLocaleDateString('default', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : 'Day Details'
        }
        description='Delivery quantity breakdown'
      >
        <div className='space-y-4'>
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
              Morning
            </p>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Cow Milk</span>
                <span className='font-semibold'>
                  {deliveryData.morningCow} L
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Buffalo Milk</span>
                <span className='font-semibold'>
                  {deliveryData.morningBuffalo} L
                </span>
              </div>
              <div className='flex justify-between border-t border-slate-200 pt-2'>
                <span className='text-slate-700 font-medium'>
                  Morning Total
                </span>
                <span className='font-bold text-primary'>{totalMorning} L</span>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
              Evening
            </p>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Cow Milk</span>
                <span className='font-semibold'>
                  {deliveryData.eveningCow} L
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Buffalo Milk</span>
                <span className='font-semibold'>
                  {deliveryData.eveningBuffalo} L
                </span>
              </div>
              <div className='flex justify-between border-t border-slate-200 pt-2'>
                <span className='text-slate-700 font-medium'>
                  Evening Total
                </span>
                <span className='font-bold text-primary'>{totalEvening} L</span>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 flex justify-between items-center'>
            <span className='text-sm font-semibold text-slate-700'>
              Total for this day
            </span>
            <span className='text-lg font-bold text-primary'>{totalDay} L</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
