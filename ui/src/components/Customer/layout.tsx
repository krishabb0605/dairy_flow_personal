import React from 'react';

const ContentLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <main className='flex-1 flex flex-col pt-16 md:pt-0'>
      {/* Fixed Title */}
      <div className='sticky top-16 p-4 md:top-0 bg-white z-10 pb-4'>
        <h1 className='text-4xl font-bold'>{title}</h1>
      </div>

      {/* Scrollable Content */}
      <div
        className='flex-1 overflow-y-auto  p-4'
        style={{ scrollbarWidth: 'none' }}
      >
        {/* For now height is given */}
        <div>{children}</div>
        {/* <div className='min-h-300 bg-red-100'>{children}</div> */}
      </div>
    </main>
  );
};

export default ContentLayout;
