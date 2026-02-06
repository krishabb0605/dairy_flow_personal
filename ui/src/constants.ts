export const API_URL = process.env.BASE_URL || 'http://localhost:3001';
export const deliveryFilters = ['All Deliveries', 'Confirmed', 'Pending'];

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
