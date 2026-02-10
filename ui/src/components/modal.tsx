'use client';

import { ModalProps } from '../types';
import Loader from './loader';

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
            <h3 className='text-xl font-bold text-[#0d1b10]'>{title}</h3>

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
              className='w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center'
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
