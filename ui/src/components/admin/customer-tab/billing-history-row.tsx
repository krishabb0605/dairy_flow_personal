import Badge from '@/components/ui/badge';
import { getBillingStatusVariant } from '@/constants';
import type { OwnerBillingApiStatus } from '@/types';

type CustomerBillingHistoryRowProps = {
  item: {
    id: string;
    month: string;
    range: string;
    qty: string;
    amount: string;
    status: OwnerBillingApiStatus;
  };
};

const formatStatusLabel = (status: OwnerBillingApiStatus) =>
  status.replace('_', ' ');

const CustomerBillingHistoryRow = ({ item }: CustomerBillingHistoryRowProps) => {
  return (
    <tr className='group hover:bg-primary/5 transition-colors' key={item.id}>
      <td className='whitespace-nowrap px-6 py-4 font-medium'>{item.month}</td>
      <td className='px-6 py-4'>{item.range}</td>
      <td className='px-6 py-4 font-mono text-xs text-slate-500'>{item.qty}</td>
      <td className='px-6 py-4 font-bold text-slate-900 '>{item.amount}</td>
      <td className='px-6 py-4 text-center'>
        <Badge variant={getBillingStatusVariant(item.status)} icon>
          {formatStatusLabel(item.status)}
        </Badge>
      </td>
    </tr>
  );
};

export default CustomerBillingHistoryRow;
