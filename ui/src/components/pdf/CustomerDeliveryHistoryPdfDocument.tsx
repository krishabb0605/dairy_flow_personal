import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { OwnerCustomerDeliveryHistoryItem } from '../../utils/types';
import { formatCurrency } from '@/utils/constants';

type CustomerDeliveryHistoryPdfProps = {
  customerName: string;
  monthLabel: string;
  records: OwnerCustomerDeliveryHistoryItem[];
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    color: '#0f172a',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  cellDate: { width: '22%' },
  cellShift: { width: '12%', textAlign: 'center' },
  cellQty: { width: '14%', textAlign: 'right' },
  cellTotalQty: { width: '14%', textAlign: 'right' },
  cellAmount: { width: '18%', textAlign: 'right' },
  cellStatus: { width: '20%', textAlign: 'center' },
  footer: {
    marginTop: 10,
    fontSize: 9,
    color: '#64748b',
  },
});

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CustomerDeliveryHistoryPdfDocument = ({
  customerName,
  monthLabel,
  records,
}: CustomerDeliveryHistoryPdfProps) => {
  const sorted = [...records].sort((a, b) => {
    if (a.date === b.date) return a.shift.localeCompare(b.shift);
    return a.date.localeCompare(b.date);
  });

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Delivery History</Text>
          <Text style={styles.subtitle}>
            {customerName} • {monthLabel}
          </Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.cellDate}>Date</Text>
          <Text style={styles.cellShift}>Shift</Text>
          <Text style={styles.cellQty}>Cow</Text>
          <Text style={styles.cellQty}>Buffalo</Text>
          <Text style={styles.cellTotalQty}>Total</Text>
          <Text style={styles.cellAmount}>Amount</Text>
          <Text style={styles.cellStatus}>Status</Text>
        </View>

        {sorted.map((row) => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.cellDate}>{formatDate(row.date)}</Text>
            <Text style={styles.cellShift}>{row.shift}</Text>
            <Text style={styles.cellQty}>{row.cowQty.toFixed(1)} L</Text>
            <Text style={styles.cellQty}>{row.buffaloQty.toFixed(1)} L</Text>
            <Text style={styles.cellTotalQty}>
              {(row.cowQty + row.buffaloQty).toFixed(1)} L
            </Text>
            <Text style={styles.cellAmount}>{formatCurrency(row.totalAmount)}</Text>
            <Text style={styles.cellStatus}>{row.status}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString('en-IN')}
        </Text>
      </Page>
    </Document>
  );
};

export default CustomerDeliveryHistoryPdfDocument;
