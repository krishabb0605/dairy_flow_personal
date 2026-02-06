'use client';
import CountdownTimer from '@/components/Customer/countDown';
import ContentLayout from '@/components/Customer/layout';
import { MilkType, Slot } from '@/types';
import { useMemo, useState } from 'react';

const quantities = [0, 0.5, 1, 1.5, 2, 2.5, 3];
const prices = {
  cow: 62,
  buffalo: 78,
};

const defaultState = {
  morning: {
    cow: 0,
    buffalo: 0,
  },
  evening: {
    cow: 0,
    buffalo: 0,
  },
};

const Delivery = () => {
  const [slot, setSlot] = useState<Slot>('morning');
  const [delivery, setDelivery] = useState(defaultState);

  const [milkType, setMilkType] = useState<MilkType>('cow');

  const handleQuantity = (type: MilkType, value: number) => {
    setDelivery((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        [type]: value,
      },
    }));
  };

  const totalPrice = useMemo(() => {
    const totalCowMilkPrice = delivery[slot].cow * prices.cow;
    const totalBuffaloMilkPrice = delivery[slot].buffalo * prices.buffalo;
    return totalCowMilkPrice + totalBuffaloMilkPrice;
  }, [delivery, slot]);

  const handleSubmit = () => {
    console.log({
      morning: delivery.morning,
      evening: delivery.evening,
    });
    setDelivery(defaultState);
  };

  return (
    <ContentLayout title='Manage Your Deliveries'>
      <main className='flex flex-col flex-1 gap-6'>
        <div className='flex flex-wrap justify-between items-end gap-3 px-2'>
          <p className='text-[#637588] text-base font-normal'>
            Schedule for tomorrow, Oct 24, 2023
          </p>
          <div className='flex gap-2'>
            <button className='flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100  text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors'>
              <span className='truncate'>View History</span>
            </button>
            <button className='flex items-center justify-center rounded-lg h-10 px-4 bg-red-50 text-red-600 text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors'>
              <span className='truncate'>Skip All Deliveries</span>
            </button>
          </div>
        </div>
        <div className='bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary text-white p-2 rounded-full flex items-center justify-center'>
              <span className='material-symbols-outlined text-lg'>timer</span>
            </div>
            <div>
              <p className='text-primary text-sm font-bold'>
                Window Closing Soon
              </p>
              <p className='text-xs text-gray-600 '>
                Edits for morning slot close in 03h 45m
              </p>
            </div>
          </div>
          <CountdownTimer />
        </div>
        <div className='flex border-b border-gray-100'>
          <button
            onClick={() => setSlot('morning')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${
              slot === 'morning'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500'
            }`}
          >
            {/* <button className='flex-1 py-4 text-sm font-bold text-primary border-b-2 border-primary bg-primary/5 flex items-center justify-center gap-2'> */}
            <span className='material-symbols-outlined text-lg'>wb_sunny</span>
            Morning (6:00 AM)
            {/* </button> */}
          </button>
          <button
            onClick={() => setSlot('evening')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${
              slot === 'evening'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500'
            }`}
          >
            {' '}
            <span className='material-symbols-outlined text-lg'>dark_mode</span>
            Evening (6:00 PM)
          </button>
        </div>
        <div className='flex flex-col gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white  rounded-xl border border-gray-200  shadow-sm overflow-hidden flex flex-col'>
              <div className='py-4 px-6 text-sm font-bold text-gray-900  border-b border-gray-100  bg-gray-50/50  flex items-center gap-2'>
                <span className='material-symbols-outlined text-lg'>
                  grocery
                </span>
                Select Milk Type
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 gap-3'>
                  {/* Cow milk */}
                  <div
                    onClick={() => setMilkType('cow')}
                    className={`p-4 rounded-xl border-2 cursor-pointer ${
                      milkType === 'cow'
                        ? 'border-primary bg-primary/8'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div className='bg-white p-2 rounded-lg text-primary shadow-sm'>
                        <span className='material-symbols-outlined text-3xl'>
                          pets
                        </span>
                      </div>
                      {milkType === 'cow' && (
                        <span className='bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase'>
                          Selected
                        </span>
                      )}
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>
                      Cow Milk
                    </h3>
                    <p className='text-sm text-gray-500 mb-3 font-medium'>
                      {`₹${prices.cow} / Liter`}
                    </p>
                  </div>

                  {/* Buffalo milk */}
                  <div
                    onClick={() => setMilkType('buffalo')}
                    className={`p-4 rounded-xl border-2 cursor-pointer ${
                      milkType === 'buffalo'
                        ? 'border-primary bg-primary8'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div className='bg-gray-100 p-2 rounded-lg text-gray-600'>
                        <span className='material-symbols-outlined text-3xl'>
                          footprint
                        </span>
                      </div>
                      {milkType === 'buffalo' && (
                        <span className='bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase'>
                          Selected
                        </span>
                      )}
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>
                      Buffalo Milk
                    </h3>
                    <p className='text-sm text-gray-500 mb-3 font-medium'>
                      {`₹${prices.buffalo} / Liter`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white  rounded-xl border border-gray-200  shadow-sm overflow-hidden flex flex-col'>
              <div className='py-4 px-6 text-sm font-bold text-gray-900  border-b border-gray-100  bg-gray-50/50  flex items-center gap-2'>
                <span className='material-symbols-outlined text-lg'>
                  remove_shopping_cart
                </span>
                Choose Quantity
              </div>
              <div className='p-6 flex flex-col justify-evenly items-center  flex-1'>
                <div className='flex justify-center py-6'>
                  <div className='flex flex-col items-center'>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-5xl font-black text-primary'>
                        {delivery[slot][milkType]}
                      </span>
                      <span className='text-lg font-bold text-gray-400'>
                        Liters
                      </span>
                    </div>
                    <p className='text-sm font-medium text-gray-500 mt-2'>
                      Recommended for your family size
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap justify-center gap-2 max-w-75'>
                  {/* QUANTITY */}
                  {quantities.map((quantitie) => (
                    <button
                      key={quantitie}
                      // onClick={() => setQuantity(q)}
                      onClick={() => handleQuantity(milkType, quantitie)}
                      className={`px-5 py-2.5 rounded-full font-bold transition-colors text-sm ${
                        delivery[slot][milkType] === quantitie
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-primary/10 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {quantitie}L
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white  rounded-xl border border-gray-200  shadow-sm overflow-hidden'>
            <div className='p-6 flex flex-col md:flex-row items-center justify-between gap-6'>
              <div className='flex items-center gap-8'>
                <div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                    Morning Total
                  </p>
                  <p className='text-xl font-black text-gray-900 '>
                    {`${delivery[slot].cow + delivery[slot].buffalo} L • ₹${totalPrice}`}
                  </p>
                </div>
                <div className='h-10 w-[1px] bg-gray-100  hidden md:block'></div>
                <div className='flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg'>
                  <span className='material-symbols-outlined text-sm'>
                    verified
                  </span>
                  <span className='text-xs font-bold'>Standard Delivery</span>
                </div>
              </div>
              <button
                className='w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3'
                onClick={handleSubmit}
              >
                <span className='material-symbols-outlined'>update</span>
                {`Update ${slot} Schedule`}
              </button>
            </div>
          </div>
        </div>
        <p className='text-center text-xs text-gray-400 px-4'>
          Note: Changes made to the Morning Schedule will only affect the 6:00
          AM delivery slot. Evening deliveries remain unchanged unless updated
          separately.
        </p>
      </main>
    </ContentLayout>
  );
};

export default Delivery;
