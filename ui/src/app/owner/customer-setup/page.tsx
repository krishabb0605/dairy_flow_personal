'use client';
import { useState } from 'react';
import ContentLayout from '../../../components/layout';
import { invitedCustomers } from '../../../constants';
import Pagination from '../../../components/pagination';

const CustomerSetup = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const PER_PAGE = 3;

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(invitedCustomers.length / PER_PAGE);

  const paginatedCustomers = invitedCustomers.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );
  console.log({ mobileNumber });

  return (
    <ContentLayout title='Quick Customer Setup'>
      <div className='flex flex-col gap-8'>
        {/* <!-- Page Heading --> */}
        <p className='text-[#637588] text-lg font-normal'>
          Enter a mobile number to generate a unique customer ID and onboarding
          link instantly.
        </p>
        {/* <!-- Generation Section --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* <!-- Input Card --> */}
          <div className='bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#f0f2f4]'>
            <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary'>
                add_circle
              </span>
              Generate New ID
            </h3>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-[#637588]'>
                  Customer Mobile Number
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[#637588] font-medium'>
                    +91
                  </span>
                  <input
                    className='w-full pl-12 pr-4 py-3 rounded-lg border-[#f0f2f4] bg-background-light focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all'
                    placeholder='98765 43210'
                    type='tel'
                    maxLength={10}
                    value={mobileNumber ?? ''}
                    onChange={(e) =>
                      setMobileNumber(e.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
              </div>
              <button className='w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20'>
                <span className='material-symbols-outlined'>
                  barcode_scanner
                </span>
                Generate ID
              </button>
            </div>
          </div>
          {/* <!-- Result/Success Card (State: Visible after generation) --> */}
          <div className='bg-primary/5 p-6 rounded-xl border-2 border-dashed border-primary flex flex-col justify-center items-center text-center relative overflow-hidden'>
            <div className='absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-2xl'></div>
            <div className='z-10 flex flex-col items-center'>
              <span className='material-symbols-outlined text-5xl text-primary mb-2'>
                check_circle
              </span>
              <p className='text-sm font-bold text-primary uppercase tracking-widest mb-1'>
                Generated ID
              </p>
              <h2 className='text-5xl font-black text-[#111418] tracking-[0.2em] mb-4'>
                882 104
              </h2>
              <div className='flex flex-col gap-3 w-full max-w-xs'>
                <button className='bg-white text-[#111418] border border-[#f0f2f4] px-4 py-3 rounded-lg flex items-center justify-center gap-3 font-semibold hover:shadow-md transition-shadow'>
                  <span className='material-symbols-outlined text-primary'>
                    content_copy
                  </span>
                  Copy Link
                </button>
                <div className='flex items-center gap-2 text-xs text-[#637588] justify-center'>
                  <span className='material-symbols-outlined text-sm'>
                    info
                  </span>
                  Share this link via WhatsApp or SMS
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Recent Pending IDs Table --> */}
        <div className='bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#f0f2f4] overflow-hidden'>
          <div className='px-6 py-4 border-b border-[#f0f2f4] flex justify-between items-center'>
            <h3 className='text-lg font-bold'>
              Recently Generated (Completed | Pending)
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-background-light'>
                <tr>
                  <th className='px-6 py-3 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                    Mobile Number
                  </th>
                  <th className='px-6 py-3 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                    Customer ID
                  </th>
                  <th className='px-6 py-3 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                    Created
                  </th>
                  <th className='px-6 py-3 text-xs font-bold text-[#637588] uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-xs font-bold text-[#637588] uppercase tracking-wider text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#f0f2f4]'>
                {paginatedCustomers.map((c, index) => (
                  <tr
                    key={index}
                    className='hover:bg-background-light transition-colors'
                  >
                    <td className='px-6 py-4 font-medium'>{c.mobile}</td>

                    <td className='px-6 py-4'>
                      <span className='bg-[#f0f2f4] px-2 py-1 rounded font-mono text-primary font-bold'>
                        {c.id}
                      </span>
                    </td>

                    <td className='px-6 py-4 text-sm text-[#637588]'>
                      {c.created}
                    </td>

                    <td className='px-6 py-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                          c.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <span
                          className={`size-2 rounded-full ${
                            c.status === 'Completed'
                              ? 'bg-green-500'
                              : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    <td className='px-6 py-4 text-right'>
                      <button className='text-[#637588] hover:text-primary'>
                        <span className='material-symbols-outlined'>share</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
        {/* <!-- Instructions Footer --> */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='flex items-start gap-4 p-4 rounded-xl bg-white border border-[#f0f2f4]'>
            <div className='p-2 bg-primary/10 rounded text-primary'>
              <span className='material-symbols-outlined'>sms</span>
            </div>
            <div>
              <h4 className='font-bold text-sm'>Step 1: Share Link</h4>
              <p className='text-xs text-[#637588]'>
                {`Send the unique URL to the customer's phone.`}
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4 p-4 rounded-xl bg-white border border-[#f0f2f4]'>
            <div className='p-2 bg-primary/10 rounded text-primary'>
              <span className='material-symbols-outlined'>key</span>
            </div>
            <div>
              <h4 className='font-bold text-sm'>Step 2: Enter ID</h4>
              <p className='text-xs text-[#637588]'>
                Customer enters the 6-digit ID in the app.
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4 p-4 rounded-xl bg-white border border-[#f0f2f4]'>
            <div className='p-2 bg-primary/10 rounded text-primary'>
              <span className='material-symbols-outlined'>done_all</span>
            </div>
            <div>
              <h4 className='font-bold text-sm'>Step 3: Auto-Link</h4>
              <p className='text-xs text-[#637588]'>
                Customer profile is linked to your route instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default CustomerSetup;
