import { PaginationProps } from '../types';

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  return (
    <div className='px-6 py-4 bg-slate-50 border-t border-[#f0f2f4] flex justify-between items-center'>
      <p className='text-sm text-[#637588]'>
        Page {page} of {totalPages}
      </p>

      <div className='flex gap-3'>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className='w-10 h-10 flex items-center justify-center rounded border border-[#f0f2f4] text-[#637588] bg-primary/7 hover:bg-primary/10  disabled:opacity-50'
        >
          <span className='material-symbols-outlined'>chevron_left</span>
        </button>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className='w-10 h-10 flex items-center justify-center rounded border border-[#f0f2f4] text-[#637588] bg-primary/7 hover:bg-primary/10  disabled:opacity-50'
        >
          <span className='material-symbols-outlined'>chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
