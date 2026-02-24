import Button from '../../../components/ui/button';
import Badge from '../../../components/ui/badge';

type DailyDeliveryItem = {
  date: string;
  status: string;
  morning: string;
  evening: string;
};

type BillingDetailsAsideProps = {
  open: boolean;
  onClose: () => void;
  visibleDays: DailyDeliveryItem[];
  totalDays: number;
  showAllDays: boolean;
  onToggleShowAllDays: () => void;
};

const BillingDetailsAside = ({
  open,
  onClose,
  visibleDays,
  totalDays,
  showAllDays,
  onToggleShowAllDays,
}: BillingDetailsAsideProps) => {
  return (
    <>
      {open && (
        <div onClick={onClose} className='fixed inset-0 bg-black/40 z-50' />
      )}

      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white z-60 shadow-2xl transition-transform duration-300 rounded-2xl rounded-r-none
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex flex-col h-full'>
          <div className='p-6 border-b border-[#f0f2f4] flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-bold'>Detailed Breakdown</h2>
              <p className='text-sm text-[#637588]'>September 2023 Statement</p>
            </div>

            <Button
              onClick={onClose}
              variant='ghost-muted'
              className='p-2 rounded-full'
            >
              <span className='material-symbols-outlined'>close</span>
            </Button>
          </div>

          <div
            className='flex-1 overflow-y-auto p-6 space-y-4'
            style={{ scrollbarWidth: 'none' }}
          >
            <h3 className='text-xs font-bold uppercase tracking-wider text-[#637588]'>
              Daily Deliveries
            </h3>

            {visibleDays.map((day, index) => (
              <div key={index} className='border-b border-[#f0f2f4] pb-4'>
                <div className='flex justify-between items-start mb-2'>
                  <span className='font-bold text-sm'>{day.date}</span>
                  <Badge variant='success'>{day.status}</Badge>
                </div>

                <div className='grid grid-cols-2 gap-4 text-xs'>
                  <div>
                    <p className='text-[#637588] mb-1'>Morning</p>
                    <p className='font-medium'>{day.morning}</p>
                  </div>

                  <div>
                    <p className='text-[#637588] mb-1'>Evening</p>
                    <p className='font-medium'>{day.evening}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className='text-center py-4'>
              <Button
                onClick={onToggleShowAllDays}
                variant='link'
                className='text-sm font-semibold'
              >
                {!showAllDays
                  ? `View remaining ${totalDays - 3} days`
                  : 'View less'}
              </Button>
            </div>
          </div>

          <div className='p-6 border-t border-[#f0f2f4] bg-slate-50 space-y-3'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-[#637588]'>
              Statement Summary
            </h3>

            <div className='flex justify-between text-sm'>
              <span className='text-[#637588]'>Cow Milk (30L)</span>
              <span className='font-semibold'>₹1,500.00</span>
            </div>

            <div className='flex justify-between text-sm'>
              <span className='text-[#637588]'>Buffalo Milk (12L)</span>
              <span className='font-semibold'>₹680.00</span>
            </div>

            <div className='border-t border-[#e5e7eb] pt-3 flex justify-between text-base font-bold'>
              <span>Grand Total</span>
              <span>₹2,180.00</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BillingDetailsAside;
