'use client';
import { useEffect, useState } from 'react';
import Badge from '../../../components/ui/badge';
import Button from '../../../components/ui/button';
import { getBillingStatusVariant } from '../../../constants';
import type { CustomerBillingRecord } from '../../../types';

type BillingHistoryRowProps = {
  bill: CustomerBillingRecord;
  onOpenPanel: () => void;
  onPaymentMethodChange: (
    bill: CustomerBillingRecord,
    method: 'STRIPE' | 'COD',
  ) => void;
  onPayStripe: (bill: CustomerBillingRecord) => void;
  isPaying: boolean;
};

export const BillingHistoryRow = ({
  bill,
  onOpenPanel: _onOpenPanel,
  onPaymentMethodChange,
  onPayStripe,
  isPaying,
}: BillingHistoryRowProps) => {
  const [selectPaymentMethod, setSelectedPaymentMethod] = useState<
    'STRIPE' | 'COD'
  >(bill.paymentMethod);

  return (
    <tr className='hover:bg-background-light/30 transition'>
      <td className='px-6 py-4 text-sm font-bold text-slate-800'>{bill.id}</td>

      <td className='px-6 py-5'>
        <div className='flex flex-col'>
          <span className='text-[#111418] font-semibold'>{bill.month}</span>
          <span className='text-xs text-[#637588]'>{bill.range}</span>
        </div>
      </td>

      <td className='px-6 py-5 text-[#111418] font-medium'>{bill.qty}</td>

      <td className='px-6 py-5 text-[#111418] font-bold'>₹ {bill.amount}</td>

      <td className='px-6 py-5'>
        <Badge variant={getBillingStatusVariant(bill.status)} icon>
          {bill.status}
        </Badge>
      </td>

      <td className='px-6 py-5 text-right'>
        <div className='flex justify-end items-center gap-2'>
          {bill.status === 'PAID' ? (
            <Button
              variant='ghost-muted'
              className='p-2 rounded-lg transition'
              title='Invoice Download'
            >
              <span className='material-symbols-outlined' data-icon='download'>
                download
              </span>
            </Button>
          ) : (
            <div className='relative'>
              <select
                value={selectPaymentMethod}
                onChange={(e) => {
                  const nextMethod = e.target.value as 'STRIPE' | 'COD';
                  setSelectedPaymentMethod(nextMethod);
                  onPaymentMethodChange(bill, nextMethod);
                }}
                className='appearance-none border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-full pl-3 pr-8 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition disabled:opacity-50'
              >
                <option value='STRIPE'>Pay With Stripe</option>
                <option value='COD'>Cash On Delivery</option>
              </select>
              <span className='pointer-events-none absolute right-2 top-[45%] -translate-y-1/2 text-slate-400 text-base leading-none'>
                ▾
              </span>
            </div>
          )}

          {bill.status !== 'PAID' && selectPaymentMethod === 'STRIPE' && (
            <Button
              onClick={() => onPayStripe(bill)}
              variant='primary'
              className='flex-1 md:flex-none min-w-30 font-bold py-2.5 px-6 rounded-lg transition shadow-lg shadow-primary/20 disabled:opacity-60'
              disabled={isPaying}
            >
              {isPaying ? 'Processing...' : 'Pay Now'}
            </Button>
          )}

          {/* <Button
            onClick={onOpenPanel}
            variant='ghost-primary'
            className='p-2 rounded-lg transition cursor-pointer text-primary'
          >
            <span className='material-symbols-outlined'>visibility</span>
          </Button> */}
        </div>
      </td>
    </tr>
  );
};
