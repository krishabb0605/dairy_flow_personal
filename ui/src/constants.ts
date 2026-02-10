export const API_URL = process.env.BASE_URL || 'http://localhost:3001';
export const deliveryFilters = ['All Deliveries', 'Confirmed', 'Pending'];

export const milkPrices = {
  cow: 62,
  buffalo: 78,
};

export type DeliverySession = {
  type: 'Morning' | 'Evening';
  time: string;
  cow: number;
  buffalo: number;
  subtotal: number;
};

export type Delivery = {
  id: number;
  date: string;
  day: string;
  totalQty: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending';
  sessions: DeliverySession[];
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
    status: 'Overdue',
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
    status: 'Overdue',
  },
  {
    month: 'April 2023',
    range: 'April 01 - April 31',
    qty: '48.0 Liters',
    amount: '₹2,950.00',
    status: 'Overdue',
  },
];

export const invitedCustomers = [
  {
    mobile: '+91 99887 76655',
    id: '120-449',
    created: '2 mins ago',
    status: 'Pending',
  },
  {
    mobile: '+91 91234 56789',
    id: '902-113',
    created: '15 mins ago',
    status: 'Pending',
  },
  {
    mobile: '+91 88776 65544',
    id: '445-098',
    created: '1 hour ago',
    status: 'Pending',
  },
  {
    mobile: '+91 90123 45678',
    id: '221-334',
    created: '2 hours ago',
    status: 'Completed',
  },
  {
    mobile: '+91 90909 11122',
    id: '667-890',
    created: 'Yesterday',
    status: 'Pending',
  },
  {
    mobile: '+91 88877 66554',
    id: '332-100',
    created: 'Yesterday',
    status: 'Completed',
  },
  {
    mobile: '+91 77766 55443',
    id: '778-221',
    created: '2 days ago',
    status: 'Pending',
  },
  {
    mobile: '+91 66655 44332',
    id: '991-220',
    created: '3 days ago',
    status: 'Completed',
  },
];
