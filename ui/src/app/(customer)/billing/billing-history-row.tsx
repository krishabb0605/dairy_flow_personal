import Badge from '../../../components/ui/badge';
import Button from '../../../components/ui/button';
import { billingHistory, getBillingStatusVariant } from '../../../constants';

type BillingHistoryItem = (typeof billingHistory)[number];

type BillingHistoryRowProps = {
  bill: BillingHistoryItem;
  onOpenPanel: () => void;
};

export const BillingHistoryRow = ({
  bill,
  onOpenPanel,
}: BillingHistoryRowProps) => {
  return (
    <tr className='hover:bg-background-light/30 transition'>
      <td className='px-6 py-5'>
        <div className='flex flex-col'>
          <span className='text-[#111418] font-semibold'>{bill.month}</span>
          <span className='text-xs text-[#637588]'>{bill.range}</span>
        </div>
      </td>

      <td className='px-6 py-5 text-[#111418] font-medium'>{bill.qty}</td>

      <td className='px-6 py-5 text-[#111418] font-bold'>{bill.amount}</td>

      <td className='px-6 py-5'>
        <Badge variant={getBillingStatusVariant(bill.status)} icon>
          {bill.status}
        </Badge>
      </td>

      <td className='px-6 py-5 text-right'>
        <div className='flex justify-end gap-2'>
          <Button
            onClick={onOpenPanel}
            variant='ghost-primary'
            className='p-2 rounded-lg transition cursor-pointer text-primary'
          >
            <span className='material-symbols-outlined'>visibility</span>
          </Button>

          <Button
            variant='ghost-muted'
            className='p-2 rounded-lg transition'
            title='Download'
          >
            <span className='material-symbols-outlined' data-icon='download'>
              download
            </span>
          </Button>
        </div>
      </td>
    </tr>
  );
};
