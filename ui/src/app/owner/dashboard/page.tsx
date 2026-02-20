'use client';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ContentLayout from '../../../components/layout';
import { OwnerDelivery, Slot } from '../../../types';
import DashboardCustomer from '../../../components/admin/dashboard-customer';
import Pagination from '../../../components/pagination';
import Button from '../../../components/ui/button';
import { UserContext } from '../../context/user-context';
import { getOwnerDashboard } from '../../../lib/daily-milk';
import { toast } from 'react-toastify';
import Loader from '../../../components/loader';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [selectedSlot, setSelectedSlot] = useState<Slot>('morning');
  const [deliveries, setDeliveries] = useState<OwnerDelivery[]>([]);
  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardDate, setDashboardDate] = useState('');
  const [totalCowQty, setTotalCowQty] = useState(0);
  const [totalBuffaloQty, setTotalBuffaloQty] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fetchedApiRef = useRef(false);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const formatDashboardDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const fetchDashboard = useCallback(async () => {
    const ownerId = user?.ownerSettings?.id;
    if (fetchedApiRef.current) return;
    fetchedApiRef.current = true;

    if (!ownerId) {
      setDeliveries([]);
      setDashboardDate('');
      setTotalCowQty(0);
      setTotalBuffaloQty(0);
      setTotalLiters(0);
      setTotalPages(1);
      setDashboardLoading(false);
      return;
    }

    try {
      setDashboardLoading(true);
      const data = await getOwnerDashboard(ownerId, {
        page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        slot: selectedSlot,
      });
      setDeliveries(data.deliveries);
      setDashboardDate(data.date);
      setTotalCowQty(data.totalCowQty);
      setTotalBuffaloQty(data.totalBuffaloQty);
      setTotalLiters(data.totalLiters);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch dashboard.';
      toast.error(message);
      setDeliveries([]);
      setDashboardDate('');
      setTotalCowQty(0);
      setTotalBuffaloQty(0);
      setTotalLiters(0);
      setTotalPages(1);
    } finally {
      setDashboardLoading(false);
      fetchedApiRef.current = false;
    }
  }, [page, searchQuery, selectedSlot, user?.ownerSettings?.id]);

  useEffect(() => {
    const ownerId = user?.ownerSettings?.id ?? null;

    if (!ownerId) {
      setDashboardLoading(false);
      setDeliveries([]);
      setDashboardDate('');
      setTotalCowQty(0);
      setTotalBuffaloQty(0);
      setTotalLiters(0);
      setTotalPages(1);
      return;
    }
    fetchDashboard();
  }, [fetchDashboard, user?.ownerSettings?.id]);

  const slotDeliveries = deliveries;

  return (
    <ContentLayout
      title={`Today's Overview`}
      description={dashboardDate ? formatDashboardDate(dashboardDate) : '-'}
    >
      <main className='flex-1'>
        {/* <!-- Header --> */}
        <header className='mb-8'>
          <div className='flex-1 w-full lg:w-auto rounded-full bg-[#eef6ff] border border-[#d7e9ff] p-1 flex items-center overflow-hidden shadow-sm'>
            <div className='pl-3 pr-2 text-[#6a97c8] flex items-center justify-center'>
              <span className='material-symbols-outlined text-[22px] leading-none'>
                search
              </span>
            </div>
            <input
              className='flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-700 placeholder:text-[#84a8ce] outline-none'
              placeholder='Search by name ...'
              type='text'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              variant='gradient'
              className='px-6 py-2.5 rounded-full text-sm font-medium transition-opacity shadow-[0_6px_14px_rgba(33,116,230,0.32)]'
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </header>
        {/* <!-- Summary Cards --> */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-blue-50 flex items-center justify-center'>
                <span className='material-symbols-outlined text-blue-600'>
                  cruelty_free
                </span>
              </div>
              <span className='text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full'>
                Today
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>Total Cow Milk</p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              {totalCowQty}{' '}
              <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-orange-50 flex items-center justify-center'>
                <span className='material-symbols-outlined text-orange-600'>
                  egg_alt
                </span>
              </div>
              <span className='text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full'>
                Today
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>
              Total Buffalo Milk
            </p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              {totalBuffaloQty}{' '}
              <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='size-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                <span className='material-symbols-outlined text-primary'>
                  analytics
                </span>
              </div>
              <span className='text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full'>
                Overall
              </span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>Total Liters</p>
            <p className='text-2xl font-bold text-slate-900 mt-1'>
              {totalLiters}{' '}
              <span className='text-sm font-normal text-slate-400'>L</span>
            </p>
          </div>
        </div>
        {/* <!-- Delivery Sections --> */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white pr-2'>
          <div className='flex border-b border-slate-200 w-full md:w-auto flex-1'>
            {(['morning', 'evening'] as Slot[]).map((shift, index) => (
              <Button
                key={index}
                variant='ghost-list'
                className={`flex-1 px-6 py-2.5 text-sm font-semibold border-b-2 capitalize
                ${
                  selectedSlot === shift
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }
              `}
                onClick={() => {
                  setSelectedSlot(shift);
                  setPage(1);
                }}
              >
                {shift} Slot
              </Button>
            ))}
          </div>
          <div />
        </div>
        {dashboardLoading ? (
          <div className='py-12 flex justify-center'>
            <Loader />
          </div>
        ) : (
          <div className='space-y-8'>
            <section className='bg-white border border-slate-200 rounded-xl  shadow-sm overflow-hidden'>
              <div className='overflow-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-slate-50 border-b border-slate-200'>
                    <tr>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Customer Name
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Cow Qty (L)
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Buffalo Qty (L)
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Total (L)
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                        Notes
                      </th>
                      <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100'>
                    {slotDeliveries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className='px-6 py-8 text-center text-slate-500 text-sm'
                        >
                          No deliveries found.
                        </td>
                      </tr>
                    ) : (
                      slotDeliveries.map((slotDeliverie, index) => (
                        <DashboardCustomer
                          key={index}
                          slotDeliverie={slotDeliverie}
                          setDeliveries={setDeliveries}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </section>
          </div>
        )}
      </main>
    </ContentLayout>
  );
};

export default Dashboard;
