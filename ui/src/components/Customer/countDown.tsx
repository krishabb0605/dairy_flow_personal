'use client';

import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

export default function CountdownTimer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = 1798655400000;

  return (
    <Countdown
      date={target}
      renderer={({ hours, minutes, seconds }) => (
        <div className='flex gap-4'>
          {[
            { label: 'HRS', value: hours },
            { label: 'MIN', value: minutes },
            { label: 'SEC', value: seconds },
          ].map((item) => (
            <div className='flex flex-col items-center' key={item.label}>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-primary/20 shadow-sm'>
                <p className='text-primary text-lg font-bold'>
                  {String(item.value).padStart(2, '0')}
                </p>
              </div>
              <p className='text-[10px] font-bold text-gray-400 mt-1 uppercase'>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}
    />
  );
}
