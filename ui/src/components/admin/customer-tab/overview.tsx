
const CustomerOverView = () => {
  return (
    <div className='pt-8  w-full grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* <!-- Left Column: Personal Info & Plans --> */}
      <div className='lg:col-span-2 space-y-8'>
        {/* <!-- Section: Personal Information --> */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-slate-400'>
              person
            </span>
            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
              Personal Information
            </h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Phone Number
              </p>
              <p className='text-sm font-medium text-slate-900'>
                +91 98765-43210
              </p>
            </div>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Email Address
              </p>
              <p className='text-sm font-medium text-slate-900'>
                john.doe@example.com
              </p>
            </div>
            <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm sm:col-span-2'>
              <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>
                Service Address
              </p>
              <p className='text-sm font-medium text-slate-900'>
                123 Green Valley Apartment, Sector 4, MG Road, Pune - 411001
              </p>
            </div>
          </div>
        </section>
        {/* <!-- Section: Delivery Plan --> */}
        <section>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <span className='material-symbols-outlined text-slate-400'>
                calendar_month
              </span>
              <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
                Default Delivery Plan
              </h3>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* <!-- Morning Shift --> */}
            <div className='bg-white  p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden'>
              <div className='absolute top-0 right-0 p-3 opacity-10'>
                <span className='material-symbols-outlined text-6xl'>
                  wb_sunny
                </span>
              </div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-orange-50 text-orange-600 rounded-lg'>
                  <span className='material-symbols-outlined'>wb_sunny</span>
                </div>
                <p className='font-bold text-slate-900'>
                  Morning Shift (6:00 AM)
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Cow Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>2.0 L</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2 text-slate-400'>
                    <span className='material-symbols-outlined'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Buffalo Milk</span>
                  </div>
                  <span className='text-lg font-bold text-slate-400'>
                    0.0 L
                  </span>
                </div>
              </div>
            </div>
            {/* <!-- Evening Shift --> */}
            <div className='bg-white  p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden'>
              <div className='absolute top-0 right-0 p-3 opacity-10'>
                <span className='material-symbols-outlined text-6xl'>
                  dark_mode
                </span>
              </div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-indigo-50  text-indigo-600 rounded-lg'>
                  <span className='material-symbols-outlined'>dark_mode</span>
                </div>
                <p className='font-bold text-slate-900'>
                  Evening Shift (6:00 PM)
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Cow Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>1.0 L</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-slate-50  rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-primary'>
                      water_drop
                    </span>
                    <span className='text-sm font-medium'>Buffalo Milk</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>1.0 L</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <!-- Right Column: Extras & Billing --> */}
      <div className='space-y-8'>
        {/* <!-- Section: Upcoming Extras --> */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-slate-400'>
              star
            </span>
            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
              Upcoming Extras
            </h3>
          </div>
          <div className='bg-white rounded-xl border-2 border-dashed border-slate-200 p-6 text-center'>
            <div className='w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3'>
              <span className='material-symbols-outlined text-slate-300'>
                add_shopping_cart
              </span>
            </div>
            <p className='text-sm font-medium text-slate-500 mb-4'>
              No extra requests scheduled for the next 7 days.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerOverView;
