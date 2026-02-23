'use client';

import React, { useState } from 'react';

import Modal from '../../../components/modal';

const DeliveryIssueModal = ({
  open,
  setOpen,
  customerInfo,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerInfo: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);

    console.log('Delivery Issue Modal');

    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Report Delivery Issue'
      submitText={`Mark as Flagged`}
      cancelText='Cancel'
      onSubmit={handleSubmit}
      loading={loading}
    >
      {/* <!-- Context Info Card --> */}
      <div
        className='bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100'
        data-purpose='customer-context'
      >
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-[#197fe6] text-white flex items-center justify-center rounded-full font-bold text-sm'>
            JS
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900 leading-tight'>
              {customerInfo.name}
            </p>
            <p className='text-xs text-blue-600 font-medium'>
              Route 4 • Apt 302
            </p>
          </div>
        </div>
        <div className='text-right'>
          <span className='inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white text-[#197fe6] border border-blue-200 rounded'>
            Morning Slot
          </span>
        </div>
      </div>
      {/* <!-- Issue Selection --> */}
      <div className='space-y-3' data-purpose='issue-selection'>
        <label className='block text-sm font-semibold text-gray-700'>
          Select Issue Type
        </label>
        <div className='grid grid-cols-1 gap-2'>
          {/* <!-- Option 1 --> */}
          <label className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group'>
            <input
              className='w-4 h-4 text-[#197fe6] border-gray-300 focus:ring-[#197fe6]'
              name='issue'
              type='radio'
              value='not-home'
            />
            <span className='ml-3 text-sm font-medium text-gray-700'>
              Customer Not Home
            </span>
          </label>
          {/* <!-- Option 2 --> */}
          <label className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group'>
            <input
              className='w-4 h-4 text-[#197fe6] border-gray-300 focus:ring-[#197fe6]'
              name='issue'
              type='radio'
              value='rejected'
            />
            <span className='ml-3 text-sm font-medium text-gray-700'>
              Milk Rejected
            </span>
          </label>
          {/* <!-- Option 3 --> */}
          <label className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group'>
            <input
              className='w-4 h-4 text-[#197fe6] border-gray-300 focus:ring-[#197fe6]'
              name='issue'
              type='radio'
              value='mismatch'
            />
            <span className='ml-3 text-sm font-medium text-gray-700'>
              Quantity Mismatch
            </span>
          </label>
          {/* <!-- Option 4 --> */}
          <label className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group'>
            <input
              className='w-4 h-4 text-[#197fe6] border-gray-300 focus:ring-[#197fe6]'
              name='issue'
              type='radio'
              value='other'
            />
            <span className='ml-3 text-sm font-medium text-gray-700'>
              Other
            </span>
          </label>
        </div>
      </div>
      {/* <!-- Notes Field --> */}
      <div className='space-y-2' data-purpose='notes-field'>
        <label
          className='block text-sm font-semibold text-gray-700'
          htmlFor='issue-notes'
        >
          Additional Details
        </label>
        <textarea
          className='block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#197fe6] focus:ring-[#197fe6] sm:text-sm placeholder:text-gray-400'
          id='issue-notes'
          placeholder="Describe the issue in detail for the owner's record..."
          rows={3}
        ></textarea>
      </div>
    </Modal>
  );
};

export default DeliveryIssueModal;
