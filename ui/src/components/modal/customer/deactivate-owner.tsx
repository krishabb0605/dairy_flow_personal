'use client';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { UserContext } from '../../../app/context/user-context';

import Modal from '../../../components/modal';

import { deActivateOwner } from '../../../lib/customerOwner';
import { getUser } from '../../../lib/users';

import { auth } from '../../../config/firebase-config';

const DeActivateOwnerModal = ({
  open,
  onClose,
  customerOwnerId,
}: {
  open: boolean;
  onClose: () => void;
  customerOwnerId: number;
}) => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await deActivateOwner(customerOwnerId);

      const firebaseUid = auth.currentUser?.uid;
      if (firebaseUid) {
        const latestUser = await getUser(firebaseUid);
        setUser(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));

        if (!latestUser.currentActiveOwner) {
          router.replace('/customer-pending');
        }
      }

      toast.success('Owner deactivate successfully');
      onClose();
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error while deactivating owner';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Deactivate Milkman?'
      submitText={`Yes, Deactivate`}
      cancelText='Cancel'
      onSubmit={handleSubmit}
      loading={loading}
      variant='warning'
      icon='warning'
    >
      <p className='text-gray-600 leading-relaxed text-center'>
        You will no longer receive daily deliveries or bills from this dairy.
        This action will stop all scheduled subscriptions immediately.
      </p>
    </Modal>
  );
};

export default DeActivateOwnerModal;
