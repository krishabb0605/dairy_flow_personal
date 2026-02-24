import { BadgeVariant } from './components/ui/badge';
import type { OwnerBillingApiStatus, OwnerCustomer } from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const FALLBACK_CUSTOMER_PROFILE_IMAGE =
  'https://www.shareicon.net/data/512x512/2016/09/15/829466_man_512x512.png';

export const FALLBACK_OWNER_PROFILE_IMAGE =
  'https://media.istockphoto.com/id/954805524/vector/gear-icon-vector-male-user-person-profile-avatar-symbol-on-cog-wheel-for-settings-and.jpg?s=612x612&w=0&k=20&c=-3RDhk49KIK3XUwbjB9P6UkQ0NLWRgBdnB7hrieR-pA=';

export const deliveryFilters = [
  'All Deliveries',
  'Confirmed',
  'Pending',
  'Cancelled',
];

export const dailyDeliveriesHistory = [
  {
    date: 'Sep 1, Fri',
    status: 'Delivered',
    morning: 'Cow 1L, Buffalo 0.5L',
    evening: 'Buffalo 1L',
  },
  {
    date: 'Sep 2, Sat',
    status: 'Delivered',
    morning: 'Cow 1L',
    evening: 'Buffalo 1.5L',
  },
  {
    date: 'Sep 3, Sun',
    status: 'Delivered',
    morning: 'Cow 2L',
    evening: 'No delivery',
  },

  // ====== MORE DAYS ======

  ...Array.from({ length: 27 }).map((_, i) => ({
    date: `Sep ${i + 4}`,
    status: 'Delivered',
    morning: 'Cow 1L',
    evening: 'Buffalo 1L',
  })),
];

export const billingHistory = [
  {
    month: 'September 2023',
    range: 'Sep 01 - Sep 30',
    qty: '42.0 Liters',
    amount: '₹2,180.00',
    status: 'PAID',
  },
  {
    month: 'August 2023',
    range: 'Aug 01 - Aug 31',
    qty: '45.5 Liters',
    amount: '₹2,360.00',
    status: 'PAID',
  },
  {
    month: 'July 2023',
    range: 'Jul 01 - Jul 31',
    qty: '38.0 Liters',
    amount: '₹1,950.00',
    status: 'UNPAID',
  },
  {
    month: 'June 2023',
    range: 'June 01 - June 30',
    qty: '22.0 Liters',
    amount: '₹2,580.00',
    status: 'PAID',
  },
  {
    month: 'May 2023',
    range: 'May 01 - May 31',
    qty: '15.5 Liters',
    amount: '₹1,360.00',
    status: 'UNPAID',
  },
  {
    month: 'April 2023',
    range: 'April 01 - April 31',
    qty: '48.0 Liters',
    amount: '₹2,950.00',
    status: 'UNPAID',
  },
  {
    month: 'January 2024',
    range: 'Jan 01 - Jan 31',
    qty: '25.0 Liters',
    amount: '₹1,951.00',
    status: 'PAID',
  },
];

export const ownerCustomers: OwnerCustomer[] = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+91 98765 43210',
    morningCowQty: 2,
    morningBuffaloQty: 1.5,
    eveningCowQty: 1,
    eveningBuffaloQty: 1,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    phone: '+91 98765 43211',
    morningCowQty: 1.5,
    morningBuffaloQty: 0.5,
    eveningCowQty: 0,
    eveningBuffaloQty: 0.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/151',
  },
  {
    id: 3,
    name: 'Mike Ross',
    phone: '+91 98765 43212',
    morningCowQty: 0.5,
    morningBuffaloQty: 0.5,
    eveningCowQty: 0.5,
    eveningBuffaloQty: 0.5,
    status: 'paused',
    avatar: 'https://i.pravatar.cc/152',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    phone: '+91 98765 43213',
    morningCowQty: 3,
    morningBuffaloQty: 1,
    eveningCowQty: 1,
    eveningBuffaloQty: 0.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/153',
  },
  {
    id: 5,
    name: 'Arjun Patel',
    phone: '+91 98765 43214',
    morningCowQty: 1,
    morningBuffaloQty: 0.5,
    eveningCowQty: 1,
    eveningBuffaloQty: 0,
    status: 'active',
    avatar: 'https://i.pravatar.cc/120?img=12',
  },
  {
    id: 6,
    name: 'Neha Verma',
    phone: '+91 98765 43215',
    morningCowQty: 0,
    morningBuffaloQty: 1,
    eveningCowQty: 2,
    eveningBuffaloQty: 0.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/120?img=25',
  },
  {
    id: 7,
    name: 'Ravi Kumar',
    phone: '+91 98765 43216',
    morningCowQty: 2.5,
    morningBuffaloQty: 1.5,
    eveningCowQty: 1.5,
    eveningBuffaloQty: 0.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/120?img=31',
  },
  {
    id: 8,
    name: 'Priya Nair',
    phone: '+91 98765 43217',
    morningCowQty: 0.5,
    morningBuffaloQty: 0.5,
    eveningCowQty: 0,
    eveningBuffaloQty: 0,
    status: 'paused',
    avatar: 'https://i.pravatar.cc/120?img=47',
  },
];


export const getBillingStatusVariant = (status: OwnerBillingApiStatus): BadgeVariant => {
  if (status === 'UNPAID') {
    return 'warning';
  } else if (status === 'FAILED') {
    return 'danger';
  } else if (status === 'PENDING_COD') {
    return 'gray';
  }
  return 'success';
};
