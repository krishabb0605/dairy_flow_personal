'use client';

import { useEffect, useMemo, useState } from 'react';

import Button from '../../components/ui/button';

import type { BillPdfDailyRecord, DeliveryCalendarProps } from '../../utils/types';

import { getCustomerMonthlyCalendar } from '../../lib/daily-milk';

import DailyDeliverMilkModal from '../modal/customer/daily-deliver-milk-modal';
import Loader from '../loader';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DeliveryCalendar({
  customerOwnerId,
}: DeliveryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [records, setRecords] = useState<BillPdfDailyRecord[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

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

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!customerOwnerId) {
        const fallback = Array.from({ length: daysInMonth }, (_, index) => ({
          day: index + 1,
          morningCow: 0,
          morningBuffalo: 0,
          eveningCow: 0,
          eveningBuffalo: 0,
          morningStatus: null,
          eveningStatus: null,
        }));
        setRecords(fallback);
        return;
      }

      setCalendarLoading(true);
      try {
        const monthValue = new Date(Date.UTC(year, month, 1))
          .toISOString()
          .slice(0, 10);
        const data = await getCustomerMonthlyCalendar(customerOwnerId, {
          month: monthValue,
        });
        setRecords(data.records);
      } catch (error) {
        console.error('Failed to fetch customer calendar:', error);
        const fallback = Array.from({ length: daysInMonth }, (_, index) => ({
          day: index + 1,
          morningCow: 0,
          morningBuffalo: 0,
          eveningCow: 0,
          eveningBuffalo: 0,
          morningStatus: null,
          eveningStatus: null,
        }));
        setRecords(fallback);
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendar();
  }, [customerOwnerId, daysInMonth, month, year]);

  const recordByDay = useMemo(() => {
    const map = new Map<number, BillPdfDailyRecord>();
    for (const record of records) {
      map.set(record.day, record);
    }
    return map;
  }, [records]);

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

  if (calendarLoading) {
    return (
      <div className='flex justify-center items-center h-75'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-auto'>
      {/* HEADER */}
      <div className='px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4'>
          <div>
            <h2 className='text-base sm:text-lg font-bold'>
              Delivery Calendar
            </h2>
            <p className='text-xs sm:text-sm text-slate-500'>
              Track and manage your daily milk supply
            </p>
          </div>
          <div className='flex items-stretch sm:items-center gap-2 p-2'>
            <div className='relative flex-1'>
              <select
                className='appearance-none h-10 w-full sm:min-w-36 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
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

            <div className='relative flex-1'>
              <select
                className='appearance-none h-10 w-full sm:min-w-24 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
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

        <div className='flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-200 p-1 rounded-xl'>
          <Button
            onClick={() => changeMonth(-1)}
            variant='ghost-list'
            className='p-2 rounded-lg size-10'
          >
            <span className='material-symbols-outlined'>chevron_left</span>
          </Button>

          <span className='px-2 sm:px-3 font-bold text-xs sm:text-sm'>
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>

          <Button
            disabled={!canGoNextMonth}
            onClick={() => changeMonth(1)}
            variant='ghost-list'
            className={`p-2 rounded-lg size-10 ${
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
      <div className='grid grid-cols-7 px-4 sm:px-6 pt-3 sm:pt-4'>
        {weekDays.map((d) => (
          <div
            key={d}
            className='text-center text-[10px] sm:text-sm font-bold text-slate-400 py-2'
          >
            {d.toLocaleUpperCase()}
          </div>
        ))}
      </div>

      {/* DAYS */}
      <div className='p-4 sm:p-6 pt-0'>
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
                className={`aspect-square p-2 sm:p-3 cursor-pointer transition relative
                ${
                  d.disabled
                    ? 'bg-slate-50 opacity-40'
                    : isFuture
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-slate-100'
                }
                ${isToday && 'border-2 border-primary bg-primary/5'}`}
              >
                <span className='text-xs sm:text-sm font-bold'>{d.day}</span>

                {!d.disabled && !isFuture && (
                  <div className='flex flex-col items-center justify-center h-full -mt-3 sm:-mt-4'>
                    {(() => {
                      const record = recordByDay.get(d.day);
                      const morning =
                        (record?.morningCow ?? 0) +
                        (record?.morningBuffalo ?? 0);
                      const evening =
                        (record?.eveningCow ?? 0) +
                        (record?.eveningBuffalo ?? 0);
                      const totalDay = morning + evening;

                      return (
                        <>
                          <div className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase'>
                            {totalDay}L
                          </div>

                          <div className='size-1.5 rounded-full mt-1 bg-primary'></div>
                        </>
                      );
                    })()}
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

      <DailyDeliverMilkModal
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate}
        record={selectedDate ? recordByDay.get(selectedDate.getDate()) : null}
        loading={calendarLoading}
      />
    </div>
  );
}
