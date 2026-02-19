import type {
  Delivery,
  OwnerCustomer,
  OwnerCustomerDeliveryHistoryItem,
  OwnerDelivery,
} from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const FALLBACK_CUSTOMER_PROFILE_IMAGE =
  'https://www.shareicon.net/data/512x512/2016/09/15/829466_man_512x512.png';

export const FALLBACK_OWNER_PROFILE_IMAGE =
  'https://media.istockphoto.com/id/954805524/vector/gear-icon-vector-male-user-person-profile-avatar-symbol-on-cog-wheel-for-settings-and.jpg?s=612x612&w=0&k=20&c=-3RDhk49KIK3XUwbjB9P6UkQ0NLWRgBdnB7hrieR-pA=';

export const deliveryFilters = ['All Deliveries', 'Confirmed', 'Pending'];

export const milkPrices = {
  cow: 62,
  buffalo: 78,
};

export const deliveries: Delivery[] = [
  {
    id: 1,
    date: 'Oct 24, 2023',
    day: 'Tuesday',
    totalQty: 5.5,
    totalPrice: 8.25,
    status: 'Confirmed',
    sessions: [
      {
        type: 'Morning',
        time: '6:45 AM',
        cow: 1,
        buffalo: 1.5,
        subtotal: 3.75,
      },
      { type: 'Evening', time: '5:30 PM', cow: 2, buffalo: 1, subtotal: 4.5 },
    ],
  },

  {
    id: 2,
    date: 'Oct 23, 2023',
    day: 'Monday',
    totalQty: 1.5,
    totalPrice: 2.25,
    status: 'Pending',
    sessions: [
      {
        type: 'Morning',
        time: '7:00 AM',
        cow: 1.5,
        buffalo: 0,
        subtotal: 2.25,
      },
    ],
  },

  {
    id: 3,
    date: 'Oct 22, 2023',
    day: 'Sunday',
    totalQty: 3,
    totalPrice: 4.5,
    status: 'Confirmed',
    sessions: [
      { type: 'Evening', time: '6:00 PM', cow: 2, buffalo: 1, subtotal: 4.5 },
    ],
  },

  {
    id: 4,
    date: 'Oct 21, 2023',
    day: 'Saturday',
    totalQty: 4,
    totalPrice: 6,
    status: 'Confirmed',
    sessions: [
      { type: 'Morning', time: '6:30 AM', cow: 2, buffalo: 2, subtotal: 6 },
    ],
  },

  {
    id: 5,
    date: 'Oct 20, 2023',
    day: 'Friday',
    totalQty: 2.5,
    totalPrice: 3.75,
    status: 'Pending',
    sessions: [
      {
        type: 'Evening',
        time: '5:45 PM',
        cow: 1,
        buffalo: 1.5,
        subtotal: 3.75,
      },
    ],
  },

  {
    id: 6,
    date: 'Oct 19, 2023',
    day: 'Thursday',
    totalQty: 5,
    totalPrice: 7.5,
    status: 'Confirmed',
    sessions: [
      { type: 'Morning', time: '6:15 AM', cow: 3, buffalo: 2, subtotal: 7.5 },
    ],
  },

  {
    id: 7,
    date: 'Oct 18, 2023',
    day: 'Wednesday',
    totalQty: 3.5,
    totalPrice: 5.25,
    status: 'Confirmed',
    sessions: [
      {
        type: 'Evening',
        time: '5:20 PM',
        cow: 2,
        buffalo: 1.5,
        subtotal: 5.25,
      },
    ],
  },

  {
    id: 8,
    date: 'Oct 17, 2023',
    day: 'Tuesday',
    totalQty: 2,
    totalPrice: 3,
    status: 'Pending',
    sessions: [
      { type: 'Morning', time: '6:50 AM', cow: 2, buffalo: 0, subtotal: 3 },
    ],
  },

  {
    id: 9,
    date: 'Oct 16, 2023',
    day: 'Monday',
    totalQty: 4.5,
    totalPrice: 6.75,
    status: 'Confirmed',
    sessions: [
      {
        type: 'Evening',
        time: '5:40 PM',
        cow: 3,
        buffalo: 1.5,
        subtotal: 6.75,
      },
    ],
  },

  {
    id: 10,
    date: 'Oct 15, 2023',
    day: 'Sunday',
    totalQty: 1,
    totalPrice: 1.5,
    status: 'Pending',
    sessions: [
      { type: 'Morning', time: '7:10 AM', cow: 1, buffalo: 0, subtotal: 1.5 },
    ],
  },

  {
    id: 11,
    date: 'Oct 14, 2023',
    day: 'Saturday',
    totalQty: 6,
    totalPrice: 9,
    status: 'Confirmed',
    sessions: [
      { type: 'Evening', time: '6:05 PM', cow: 4, buffalo: 2, subtotal: 9 },
    ],
  },

  {
    id: 12,
    date: 'Oct 13, 2023',
    day: 'Friday',
    totalQty: 2,
    totalPrice: 3,
    status: 'Confirmed',
    sessions: [
      { type: 'Morning', time: '6:35 AM', cow: 2, buffalo: 0, subtotal: 3 },
    ],
  },
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
    status: 'Paid',
  },
  {
    month: 'August 2023',
    range: 'Aug 01 - Aug 31',
    qty: '45.5 Liters',
    amount: '₹2,360.00',
    status: 'Paid',
  },
  {
    month: 'July 2023',
    range: 'Jul 01 - Jul 31',
    qty: '38.0 Liters',
    amount: '₹1,950.00',
    status: 'pending',
  },
  {
    month: 'June 2023',
    range: 'June 01 - June 30',
    qty: '22.0 Liters',
    amount: '₹2,580.00',
    status: 'Paid',
  },
  {
    month: 'May 2023',
    range: 'May 01 - May 31',
    qty: '15.5 Liters',
    amount: '₹1,360.00',
    status: 'pending',
  },
  {
    month: 'April 2023',
    range: 'April 01 - April 31',
    qty: '48.0 Liters',
    amount: '₹2,950.00',
    status: 'pending',
  },
  {
    month: 'January 2024',
    range: 'Jan 01 - Jan 31',
    qty: '25.0 Liters',
    amount: '₹1,951.00',
    status: 'Paid',
  },
];

export const ownerDeliveries = [
  {
    id: 1,
    initials: 'JS',
    name: 'John Sharma',
    shift: 'morning',
    cowMilkQty: 2.0,
    buffaloMilkQty: 2.0,
    status: 'delivered',
    date: 'Feb 8, 2026',
  },
  {
    id: 2,
    initials: 'AM',
    name: 'Aditi Mehra',
    shift: 'morning',
    cowMilkQty: 1.5,
    buffaloMilkQty: 1.5,
    status: 'delivered',
    date: 'Feb 10, 2026',
  },
  {
    id: 3,
    initials: 'RK',
    name: 'Rahul Kapoor',
    shift: 'evening',
    cowMilkQty: 1.0,
    buffaloMilkQty: 1.0,
    status: 'cancelled',
    date: 'Oct 23, 2023',
  },
  {
    id: 4,
    initials: 'VP',
    name: 'Vikram Patel',
    shift: 'morning',
    cowMilkQty: 3.0,
    buffaloMilkQty: 3.0,
    status: 'delivered',
    date: 'Oct 23, 2023',
  },
  {
    id: 5,
    initials: 'CE',
    name: 'Chris Evans',
    shift: 'evening',
    cowMilkQty: 3.0,
    buffaloMilkQty: 3.0,
    status: 'skipped',
    date: 'Oct 22, 2023',
  },
];

export const ownerDashboardDeliveriesData: OwnerDelivery[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    address: 'Sector 12, Flat 402',
    cowQty: 2,
    buffaloQty: 1,
    slot: 'morning',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Priya Patel',
    address: 'Green Avenue, Villa 12',
    cowQty: 0,
    buffaloQty: 2,
    slot: 'morning',
    status: 'delivered',
  },
  {
    id: 3,
    name: 'Amit Verma',
    address: 'Sector 15, Block B',
    cowQty: 1.5,
    buffaloQty: 0.5,
    slot: 'morning',
    status: 'skipped',
  },
  {
    id: 4,
    name: 'Sanjay Gupta',
    address: 'Tower C, Apt 1004',
    cowQty: 1,
    buffaloQty: 0,
    slot: 'evening',
    status: 'pending',
  },
  {
    id: 5,
    name: 'Rahul 123',
    address: 'Sector 12, Flat 402',
    cowQty: 2,
    buffaloQty: 1,
    slot: 'morning',
    status: 'pending',
  },
  {
    id: 6,
    name: 'Priya 123',
    address: 'Green Avenue, Villa 12',
    cowQty: 0,
    buffaloQty: 2,
    slot: 'morning',
    status: 'delivered',
  },
  {
    id: 7,
    name: 'Amit 123',
    address: 'Sector 15, Block B',
    cowQty: 1.5,
    buffaloQty: 0.5,
    slot: 'morning',
    status: 'pending',
  },
  {
    id: 8,
    name: 'Sanjay 123',
    address: 'Tower C, Apt 1004',
    cowQty: 1,
    buffaloQty: 0,
    slot: 'evening',
    status: 'pending',
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

export const ownerCustomerDeliveryHistory: OwnerCustomerDeliveryHistoryItem[] =
  [
    {
      id: 1,
      date: '2023-10-24',
      shift: 'morning',
      cowQty: 2,
      buffaloQty: 0,
      status: 'delivered',
    },
    {
      id: 2,
      date: '2023-10-23',
      shift: 'evening',
      cowQty: 0,
      buffaloQty: 1.5,
      status: 'skipped',
    },
    {
      id: 3,
      date: '2023-10-23',
      shift: 'morning',
      cowQty: 2,
      buffaloQty: 0,
      status: 'delivered',
    },
    {
      id: 4,
      date: '2023-10-22',
      shift: 'evening',
      cowQty: 0,
      buffaloQty: 1.5,
      status: 'cancelled',
    },
    {
      id: 5,
      date: '2023-10-21',
      shift: 'morning',
      cowQty: 1.5,
      buffaloQty: 0.5,
      status: 'pending',
    },
    {
      id: 6,
      date: '2023-10-20',
      shift: 'evening',
      cowQty: 1,
      buffaloQty: 1,
      status: 'delivered',
    },
    {
      id: 7,
      date: '2023-10-19',
      shift: 'morning',
      cowQty: 2.5,
      buffaloQty: 0,
      status: 'pending',
    },
    {
      id: 8,
      date: '2023-10-18',
      shift: 'evening',
      cowQty: 0.5,
      buffaloQty: 1.5,
      status: 'delivered',
    },
  ];
