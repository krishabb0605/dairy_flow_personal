'use client';

import { ModalProps } from '../types';
import Loader from './loader';

const getColor = (variant = 'primary') => {
  if (variant === 'warning') {
    return 'bg-orange-600 hover:bg-orange-700';
  }

  return 'bg-primary';
};

const getIcon = (variant = 'default') => {
  if (variant === 'warning') {
    return (
      <div className='bg-orange-100 p-3 rounded-full'>
        <svg
          className='h-8 w-8 text-orange-600'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
        </svg>
      </div>
    );
  }
};

const Modal = ({
  open,
  title,
  description,
  submitText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onSubmit,
  onClose,
  onCancel,
  variant = 'primary',
  icon = 'default',
  children,
}: ModalProps) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0d1b10]/40 backdrop-blur-sm p-4'>
      {/* Card */}
      <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-[#e7f3e9] flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-bold text-[#0d1b10] flex items-center gap-3'>
              {getIcon(icon)}
              {title}
            </h3>

            {description && (
              <p className='text-sm text-gray-400 mt-1'>{description}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>

        {/* Body */}
        <div className='p-6 space-y-6'>{children}</div>

        {/* Footer */}
        <div className='px-6 py-5 bg-[#f8fcf9] flex flex-col gap-3'>
          {onSubmit && (
            <button
              disabled={loading}
              onClick={onSubmit}
              className={`w-full text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center ${getColor(variant)}`}
            >
              {loading ? <Loader color='white' size={24} /> : submitText}
            </button>
          )}

          <button
            onClick={onCancel || onClose}
            className='w-full text-gray-500 font-medium py-2 text-sm hover:text-gray-700'
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
