'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { pdf } from '@react-pdf/renderer';

import ContentLayout from '../../../components/layout';
import CustomerInvoicePdfDocument from '../../../components/pdf/CustomerInvoicePdfDocument';
import Button from '../../../components/ui/button';
import { Table, TableBody, TableHead } from '../../../components/ui/table';

import type { BillPdfDailyRecord, OwnerCustomerProfile } from '../../../utils/types';
import { UserContext } from '../../context/user-context';
import { getCustomerProfile } from '../../../lib/customerSettings';
import { getCustomerMonthlyCalendar } from '../../../lib/daily-milk';
import { toast } from 'react-toastify';

const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const buildYearOptions = (count = 6) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, index) => String(currentYear - index));
};

const formatMonthYear = (monthIndex: number, year: number) =>
  `${MONTH_OPTIONS[monthIndex]} ${year}`;

const GenerateBillPage = () => {
  const { user } = useContext(UserContext);
  const [customerOwnerIdInput, setCustomerOwnerIdInput] = useState('');
  const [monthInput, setMonthInput] = useState(String(new Date().getMonth()));
  const [yearInput, setYearInput] = useState(String(new Date().getFullYear()));
  const [selectedCustomer, setSelectedCustomer] =
    useState<OwnerCustomerProfile | null>(null);
  const [records, setRecords] = useState<BillPdfDailyRecord[]>([]);
  const [cowRate, setCowRate] = useState('62');
  const [buffaloRate, setBuffaloRate] = useState('78');
  const [loading, setLoading] = useState(false);
  const yearOptions = useMemo(() => buildYearOptions(), []);

  useEffect(() => {
    if (!user?.ownerSettings) return;
    setCowRate(String(user.ownerSettings.cowPrice ?? ''));
    setBuffaloRate(String(user.ownerSettings.buffaloPrice ?? ''));
  }, [user?.ownerSettings]);

  const displayRecords = useMemo(() => {
    if (records.length > 0) return records;

    const monthIndex = Number(monthInput);
    const year = Number(yearInput);
    if (Number.isNaN(monthIndex) || Number.isNaN(year)) return [];

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      morningCow: 0,
      morningBuffalo: 0,
      eveningCow: 0,
      eveningBuffalo: 0,
    }));
  }, [records, monthInput, yearInput]);

  const leftRows = displayRecords.filter((item) => item.day <= 16);
  const rightRows = displayRecords.filter((item) => item.day > 16);
  const maxRows = Math.max(leftRows.length, rightRows.length);

  const totalMorningCowLtrs = useMemo(
    () => displayRecords.reduce((sum, item) => sum + item.morningCow, 0),
    [displayRecords],
  );

  const totalMorningBuffaloLtrs = useMemo(
    () => displayRecords.reduce((sum, item) => sum + item.morningBuffalo, 0),
    [displayRecords],
  );

  const totalEveningCowLtrs = useMemo(
    () => displayRecords.reduce((sum, item) => sum + item.eveningCow, 0),
    [displayRecords],
  );

  const totalEveningBuffaloLtrs = useMemo(
    () => displayRecords.reduce((sum, item) => sum + item.eveningBuffalo, 0),
    [displayRecords],
  );

  const totalCowLtrs = useMemo(
    () =>
      displayRecords.reduce(
        (sum, item) => sum + item.morningCow + item.eveningCow,
        0,
      ),
    [displayRecords],
  );

  const totalBuffaloLtrs = useMemo(
    () =>
      displayRecords.reduce(
        (sum, item) => sum + item.morningBuffalo + item.eveningBuffalo,
        0,
      ),
    [displayRecords],
  );

  const grandTotal = useMemo(() => {
    const cow = Number(cowRate) || 0;
    const buffalo = Number(buffaloRate) || 0;
    return totalCowLtrs * cow + totalBuffaloLtrs * buffalo;
  }, [cowRate, buffaloRate, totalCowLtrs, totalBuffaloLtrs]);

  const onFind = async () => {
    const customerId = Number(customerOwnerIdInput);
    const monthIndex = Number(monthInput);
    const year = Number(yearInput);

    if (!customerId || Number.isNaN(monthIndex) || Number.isNaN(year)) {
      toast.error('Please enter valid Customer ID, Month and Year.');
      setSelectedCustomer(null);
      setRecords([]);
      return;
    }

    try {
      setLoading(true);
      const profile = await getCustomerProfile(customerId);
      const month = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      const calendar = await getCustomerMonthlyCalendar(customerId, { month });

      setSelectedCustomer(profile);
      setRecords(calendar.records ?? []);
    } catch (error: unknown) {
      const messageText =
        error instanceof Error
          ? error.message
          : 'Failed to fetch customer data.';
      toast.error(messageText);
      setSelectedCustomer(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const onPreviewPdf = async () => {
    const monthYear = formatMonthYear(Number(monthInput), Number(yearInput));

    const pdfDoc = (
      <CustomerInvoicePdfDocument
        dairyName={user?.ownerSettings?.dairyName ?? 'Dairy'}
        customerName={selectedCustomer?.name ?? '-'}
        customerPhone={selectedCustomer?.phone ?? '-'}
        customerAddress={selectedCustomer?.address ?? '-'}
        customerId={String(selectedCustomer?.id ?? '-')}
        invoiceId='INV-DRAFT'
        billYear={Number(yearInput)}
        billMonth={Number(monthInput) + 1}
        monthYear={monthYear}
        totalPaid={grandTotal}
        records={displayRecords}
      />
    );

    const blob = await pdf(pdfDoc).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <ContentLayout title='Generate Monthly Bill'>
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
          <div>
            <label className='block text-xs font-bold text-slate-500 uppercase mb-1'>
              Customer Owner Id
            </label>
            <input
              value={customerOwnerIdInput}
              onChange={(e) => setCustomerOwnerIdInput(e.target.value)}
              placeholder='e.g. 1'
              className='w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:ring-primary focus:border-primary'
            />
          </div>
          <div>
            <label className='block text-xs font-bold text-slate-500 uppercase mb-1'>
              Month
            </label>
            <select
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className='w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:ring-primary focus:border-primary'
            >
              {MONTH_OPTIONS.map((month, idx) => (
                <option key={month} value={idx}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-xs font-bold text-slate-500 uppercase mb-1'>
              Year
            </label>
            <select
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              className='w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:ring-primary focus:border-primary'
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-end'>
            <Button
              onClick={onFind}
              variant='primary'
              className='h-10 w-full rounded-lg font-bold text-sm hover:opacity-90 transition-opacity'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Find'}
            </Button>
          </div>
        </div>

        <div className='rounded-lg border border-slate-200'>
          <div className='p-4 border-b border-slate-200 bg-slate-50/60'>
            <h2 className='text-3xl font-bold text-slate-900'>
              Monthly Milk Record
            </h2>
            <p className='text-slate-500 text-sm'>
              Digital Delivery Tracking Card
            </p>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-4'>
              <div>
                <p className='text-[11px] font-bold text-slate-500 uppercase mb-1'>
                  Customer Name
                </p>
                <div className='h-10 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-slate-700 text-sm'>
                  {selectedCustomer?.name ?? '-'}
                </div>
              </div>
              <div>
                <p className='text-[11px] font-bold text-slate-500 uppercase mb-1'>
                  Mobile Number
                </p>
                <div className='h-10 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-slate-700 text-sm'>
                  {selectedCustomer?.phone ?? '-'}
                </div>
              </div>
              <div>
                <p className='text-[11px] font-bold text-slate-500 uppercase mb-1'>
                  Customer ID
                </p>
                <div className='h-10 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-slate-700 text-sm'>
                  {selectedCustomer
                    ? `CID-${String(selectedCustomer.id).padStart(3, '0')}`
                    : '-'}
                </div>
              </div>
              <div>
                <p className='text-[11px] font-bold text-slate-500 uppercase mb-1'>
                  Month & Year
                </p>
                <div className='h-10 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-slate-700 text-sm'>
                  {selectedCustomer
                    ? formatMonthYear(Number(monthInput), Number(yearInput))
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <Table>
              <TableHead className='bg-transparent border-b-0'>
                <tr className='bg-slate-100 border-b border-slate-200'>
                  <th className='px-3 py-2 text-xs font-bold uppercase text-slate-600'>
                    Day
                  </th>
                  <th
                    className='px-3 py-2 text-xs font-bold uppercase text-slate-600'
                    colSpan={2}
                  >
                    Morning
                  </th>
                  <th
                    className='px-3 py-2 text-xs font-bold uppercase text-slate-600'
                    colSpan={2}
                  >
                    Evening
                  </th>

                  <th className='px-3 py-2 text-xs font-bold uppercase text-slate-600 border-l border-slate-300'>
                    Day
                  </th>
                  <th
                    className='px-3 py-2 text-xs font-bold uppercase text-slate-600'
                    colSpan={2}
                  >
                    Morning
                  </th>
                  <th
                    className='px-3 py-2 text-xs font-bold uppercase text-slate-600'
                    colSpan={2}
                  >
                    Evening
                  </th>
                </tr>
                <tr className='bg-slate-50/60 border-b border-slate-200'>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'></th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Cow
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Buf
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Cow
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Buf
                  </th>

                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500 border-l border-slate-300'></th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Cow
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Buf
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Cow
                  </th>
                  <th className='px-3 py-2 text-[11px] font-semibold text-slate-500'>
                    Buf
                  </th>
                </tr>
              </TableHead>
              <TableBody className='divide-y-0'>
                {Array.from({ length: maxRows }).map((_, index) => {
                  const left = leftRows[index];
                  const right = rightRows[index];
                  return (
                    <tr key={index} className='border-b border-slate-100'>
                      <td className='px-3 py-2 text-center text-sm'>
                        {left?.day ?? ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {left ? left.morningCow.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {left ? left.morningBuffalo.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {left ? left.eveningCow.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {left ? left.eveningBuffalo.toFixed(1) : ''}
                      </td>

                      <td className='px-3 py-2 text-center text-sm border-l border-slate-300'>
                        {right?.day ?? ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {right ? right.morningCow.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {right ? right.morningBuffalo.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {right ? right.eveningCow.toFixed(1) : ''}
                      </td>
                      <td className='px-3 py-2 text-center text-sm text-slate-600'>
                        {right ? right.eveningBuffalo.toFixed(1) : ''}
                      </td>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-5 border-t border-slate-200'>
            <div className='bg-slate-100 text-slate-700 font-bold px-4 py-3 text-right'>
              Totals:
            </div>
            <div className='bg-slate-50 text-slate-700 font-bold px-4 py-3 text-center border-l border-slate-200'>
              Morning Cow: {totalMorningCowLtrs.toFixed(1)} L
            </div>
            <div className='bg-slate-50 text-slate-700 font-bold px-4 py-3 text-center border-l border-slate-200'>
              Morning Buf: {totalMorningBuffaloLtrs.toFixed(1)} L
            </div>
            <div className='bg-slate-50 text-slate-700 font-bold px-4 py-3 text-center border-l border-slate-200'>
              Evening Cow: {totalEveningCowLtrs.toFixed(1)} L
            </div>
            <div className='bg-slate-50 text-slate-700 font-bold px-4 py-3 text-center border-l border-slate-200'>
              Evening Buf: {totalEveningBuffaloLtrs.toFixed(1)} L
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='bg-white border border-slate-200 rounded-xl p-4'>
            <h3 className='text-lg font-bold text-slate-800 mb-3'>
              Rate Settings (per Liter)
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-bold uppercase text-slate-500 mb-1'>
                  Cow Milk Rate
                </label>
                <input
                  value={cowRate}
                  onChange={(e) => setCowRate(e.target.value)}
                  className='w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm'
                />
              </div>
              <div>
                <label className='block text-xs font-bold uppercase text-slate-500 mb-1'>
                  Buffalo Milk Rate
                </label>
                <input
                  value={buffaloRate}
                  onChange={(e) => setBuffaloRate(e.target.value)}
                  className='w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm'
                />
              </div>
            </div>
          </div>

          <div className='bg-blue-600 text-white rounded-xl p-5 flex flex-col justify-center'>
            <p className='text-sm font-semibold text-blue-100'>
              Monthly Grand Total
            </p>
            <p className='text-5xl font-black mt-1'>
              ₹ {grandTotal.toFixed(2)}
            </p>
            <p className='text-sm text-blue-100 mt-2'>
              Based on total quantity delivered and set rates.
            </p>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            onClick={onPreviewPdf}
            variant='outline-muted'
            className='h-10 px-5 rounded-lg font-semibold'
          >
            Preview / Print
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
};

export default GenerateBillPage;
