/* eslint-disable @next/next/no-page-custom-font */
'use client';

import './globals.css';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from './context/user-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <ToastContainer />
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
