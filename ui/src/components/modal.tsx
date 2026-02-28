'use client';

import Button from '../components/ui/button';

import { ModalProps } from '../utils/types';

import Loader from './loader';

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
  const buttonVariant = variant === 'warning' ? 'warning' : 'primary';
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

          <Button onClick={onClose} variant='link-gray' className='size-10'>
            <span className='material-symbols-outlined'>close</span>
          </Button>
        </div>

        {/* Body */}
        <div className='p-6 space-y-6'>{children}</div>

        {/* Footer */}
        <div className='px-6 py-5 bg-[#f8fcf9] flex flex-col gap-3'>
          {onSubmit && (
            <Button
              disabled={loading}
              onClick={onSubmit}
              variant={buttonVariant}
              className='w-full font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center'
            >
              {loading ? <Loader color='white' size={24} /> : submitText}
            </Button>
          )}

          <Button
            onClick={onCancel || onClose}
            variant='link-gray'
            className='w-full font-medium py-2 text-sm'
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
