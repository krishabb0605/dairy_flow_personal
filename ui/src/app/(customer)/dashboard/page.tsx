import ContentLayout from '../../../components/Customer/layout';
import DeliveryCalendar from '../../../components/Customer/calender';

const Dashboard = () => {
  return (
    <ContentLayout title='Dashboard Overview'>
      <div className='flex-1 space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200  shadow-sm'>
            <div className='flex justify-between items-start mb-4'>
              <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                Liters This Month
              </span>
              <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                <span className='material-symbols-outlined leading-none'>
                  opacity
                </span>
              </div>
            </div>
            <p className='text-4xl font-bold'>48.5L</p>
            <p className='text-sm text-primary font-semibold mt-2 flex items-center gap-1'>
              <span className='material-symbols-outlined text-sm'>
                trending_up
              </span>{' '}
              +5.2% from last month
            </p>
          </div>
          <div className='bg-white  p-6 rounded-2xl border border-slate-200  shadow-sm'>
            <div className='flex justify-between items-start mb-4'>
              <span className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
                Current Bill
              </span>
              <div className='p-2 bg-green-50  text-green-600 rounded-lg'>
                <span className='material-symbols-outlined leading-none'>
                  payments
                </span>
              </div>
            </div>
            <p className='text-4xl font-bold'>₹2,910</p>
            <p className='text-sm text-slate-500 mt-2'>Unpaid balance: ₹0</p>
          </div>
        </div>

        <DeliveryCalendar />
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
