import React from 'react';

const ContentLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <main className='flex-1 flex flex-col pt-14 md:pt-0'>
      {/* Fixed Title */}
      <div className='sticky top-14 p-4 md:top-0 bg-white z-10 pb-4'>
        <h1 className='text-4xl font-bold'>{title}</h1>
      </div>

      <div className='p-4'>{children}</div>
    </main>
  );
};

export default ContentLayout;
