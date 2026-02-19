'use client';
import Modal from '../../../components/modal';
import { milkPrices } from '../../../constants';
import {
  type AddExtraMilkDeliveryState,
  type AddExtraMilkModalProps,
  type CustomerOwner,
  type MilkType,
  type Slot,
} from '../../../types';
import { useContext, useMemo, useState } from 'react';
import { createExtraMilkOrder } from '../../../lib/extra-milk-order';
import { UserContext } from '../../../app/context/user-context';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/button';

const defaultState: AddExtraMilkDeliveryState = {
  morning: {
    cow: 0,
    buffalo: 0,
  },
  evening: {
    cow: 0,
    buffalo: 0,
  },
};

const getLocalDateInputValue = (date: Date): string => {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs)
    .toISOString()
    .split('T')[0];
};

const extractTimeFromOwnerSetting = (value?: string | null): string | null => {
  if (!value) return null;
  const plainMatch = value.match(/^(\d{2}:\d{2})/);
  if (plainMatch) return plainMatch[1];
  const isoMatch = value.match(/T(\d{2}:\d{2})/);
  if (isoMatch) return isoMatch[1];
  return null;
};

const getCutoffTime = (time: string): Date | null => {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  const cutoff = new Date();
  cutoff.setHours(hours, minutes, 0, 0);
  cutoff.setMinutes(cutoff.getMinutes() - 30);
  return cutoff;
};

const getTodaySlotAvailability = (
  owner: CustomerOwner | null | undefined,
  now: Date,
) => {
  const morningStart = extractTimeFromOwnerSetting(owner?.morningStart);
  const eveningStart = extractTimeFromOwnerSetting(owner?.eveningStart);
  const morningCutoff = morningStart ? getCutoffTime(morningStart) : null;
  const eveningCutoff = eveningStart ? getCutoffTime(eveningStart) : null;

  return {
    morning: morningCutoff ? now < morningCutoff : false,
    evening: eveningCutoff ? now < eveningCutoff : false,
  };
};

const AddExtraMilkModal = ({
  open,
  onClose,
  onSuccess,
}: AddExtraMilkModalProps) => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot>('morning');

  const [loading, setLoading] = useState<boolean>(false);
  const [delivery, setDelivery] =
    useState<AddExtraMilkDeliveryState>(defaultState);

  const updateQty = (milk: MilkType, delta: number) => {
    setDelivery((prev) => {
      const current = prev[selectedSlot][milk];

      const next = Math.max(0, +(current + delta).toFixed(1));

      return {
        ...prev,
        [selectedSlot]: {
          ...prev[selectedSlot],
          [milk]: next,
        },
      };
    });
  };

  const total = useMemo(() => {
    const cowPrice = delivery[selectedSlot].cow * milkPrices.cow;
    const buffaloPrice = delivery[selectedSlot].buffalo * milkPrices.buffalo;
    return cowPrice + buffaloPrice;
  }, [delivery, selectedSlot]);

  const now = new Date();
  const today = getLocalDateInputValue(now);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = getLocalDateInputValue(tomorrowDate);

  const todaySlotAvailability = getTodaySlotAvailability(
    user?.currentActiveOwner,
    now,
  );

  const isTodaySelectable =
    todaySlotAvailability.morning || todaySlotAvailability.evening;

  const minDate = isTodaySelectable ? today : tomorrow;

  const isTodaySelected = date === today;

  const isSlotDisabled = (slot: Slot) =>
    isTodaySelected ? !todaySlotAvailability[slot] : false;

  const handleSubmit = async () => {
    const cowQty = delivery[selectedSlot].cow;
    const buffaloQty = delivery[selectedSlot].buffalo;

    if (!user?.currentActiveOwner) {
      toast.error('No active owner found for this customer.');
      return;
    }

    if (!date) {
      toast.error('Please select a delivery date.');
      return;
    }

    if (isSlotDisabled(selectedSlot)) {
      return;
    }

    if (cowQty <= 0 && buffaloQty <= 0) {
      toast.error('Please add at least one milk quantity.');
      return;
    }

    setLoading(true);
    try {
      await createExtraMilkOrder({
        customerOwnerId: user.currentActiveOwner.id,
        deliveryDate: date,
        slot: selectedSlot,
        cowQty,
        buffaloQty,
      });
      toast.success('Extra milk request submitted successfully');
      setDate('');
      setSelectedSlot('morning');
      setDelivery(defaultState);
      await onSuccess();
      onClose();
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to submit extra milk request';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Request Extra Milk'
      description='Need a little extra tomorrow?'
      submitText={`Confirm ${selectedSlot} Order`}
      cancelText='Maybe Later'
      onSubmit={handleSubmit}
      loading={loading}
    >
      {/* <!-- Date Selection --> */}
      <div className='space-y-2'>
        <label className='text-sm font-bold text-[#0d1b10] flex items-center gap-2'>
          <span className='material-symbols-outlined text-primary text-lg'>
            calendar_today
          </span>
          Delivery Date
        </label>
        <div className='relative'>
          <input
            className='w-full border border-[#e7f3e9] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none'
            type='date'
            min={minDate}
            value={date}
            onChange={(e) => {
              const selected = e.target.value;
              setDate(selected);
              const selectedSlotInvalidForToday =
                selected === today && !todaySlotAvailability[selectedSlot];
              if (selectedSlotInvalidForToday) {
                setSelectedSlot(
                  todaySlotAvailability.morning ? 'morning' : 'evening',
                );
              }
            }}
          />
        </div>
      </div>

      {/* Shift selection */}
      <div className='space-y-4'>
        <div className='flex gap-2 p-1 rounded-xl'>
          {(['morning', 'evening'] as Slot[]).map((slot) => {
            return (
              <Button
                key={slot}
                disabled={isSlotDisabled(slot)}
                onClick={() => setSelectedSlot(slot)}
                variant='ghost-list'
                className={`flex-1 py-3 font-medium capitalize transition
                ${
                  selectedSlot === slot
                    ? 'border-b-2 border-primary bg-primary/5'
                    : 'border-b border-[#e7f3e9] text-gray-500'
                }
                ${isSlotDisabled(slot) ? 'opacity-40 cursor-not-allowed' : ''}
              `}
              >
                {slot}
              </Button>
            );
          })}
        </div>

        <div className='space-y-3'>
          {/* <!-- Cow Milk Row --> */}
          <div className='flex items-center justify-between p-3 bg-white border border-[#e7f3e9] rounded-xl'>
            <div className='flex items-center gap-3'>
              <div className='size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <span className='material-symbols-outlined'>pets</span>
              </div>
              <div>
                <p className='text-sm font-bold text-[#0d1b10]'>Cow Milk</p>
                <p className='text-[10px] text-gray-500 uppercase font-bold'>
                  ₹{milkPrices.cow}/L
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-1'>
              <Button
                onClick={() => updateQty('cow', -0.5)}
                variant='outline-muted'
                className='size-8 flex items-center justify-center rounded-md'
              >
                -
              </Button>

              <span className='text-sm font-bold min-w-8 text-center'>
                {delivery[selectedSlot].cow}L
              </span>

              <Button
                onClick={() => updateQty('cow', 0.5)}
                variant='primary'
                className='size-8 flex items-center justify-center rounded-md'
              >
                +
              </Button>
            </div>
          </div>
          {/* <!-- Buffalo Milk Row --> */}
          <div className='flex items-center justify-between p-3 bg-white border border-[#e7f3e9] rounded-xl'>
            <div className='flex items-center gap-3'>
              <div className='size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <span className='material-symbols-outlined'>grass</span>
              </div>
              <div>
                <p className='text-sm font-bold text-[#0d1b10]'>Buffalo Milk</p>
                <p className='text-[10px] text-gray-500 uppercase font-bold'>
                  ₹{milkPrices.buffalo}/L
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                onClick={() => updateQty('buffalo', -0.5)}
                variant='outline-muted'
                className='size-8 flex items-center justify-center rounded-md'
              >
                -
              </Button>

              <span className='text-sm font-bold min-w-8 text-center'>
                {delivery[selectedSlot].buffalo}L
              </span>

              <Button
                onClick={() => updateQty('buffalo', 0.5)}
                variant='primary'
                className='size-8 flex items-center justify-center rounded-md'
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Price Summary Card --> */}
      <div className='bg-primary/5 border border-blue-100 rounded-lg p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-blue-500 text-white rounded-full size-8 flex items-center justify-center'>
            <span className='material-symbols-outlined text-sm'>info</span>
          </div>
          <div>
            <p className='text-xs text-blue-600 font-medium'>Estimated Total</p>
            <p className='text-lg font-bold text-blue-900'>
              ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-[10px] text-blue-500 uppercase tracking-wider font-bold'>
            Standard Rate
          </p>
          <p className='text-xs text-blue-700'>
            {' '}
            Cow ₹{milkPrices.cow}/L · Buffalo ₹{milkPrices.buffalo}/L
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AddExtraMilkModal;
