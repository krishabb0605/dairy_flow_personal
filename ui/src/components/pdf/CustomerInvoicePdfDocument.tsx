import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { CustomerInvoicePdfProps } from '../../utils/types';
import { formatCurrency } from '@/utils/constants';

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#f1f7ff', // Light blue background outside the card
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    minHeight: '100%',
  },
  // Header Section
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  brandTagline: {
    fontSize: 7,
    color: '#0ea5e9',
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statementHeader: {
    alignItems: 'flex-end',
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statementMonth: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statementRef: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 4,
  },
  // Billed To Section
  billedSection: {
    backgroundColor: '#f8faff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  billedLabel: {
    fontSize: 7,
    color: '#38bdf8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  billedRightLabel: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'right',
    marginBottom: 6,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 8,
    color: '#64748b',
    width: 150,
    lineHeight: 1.4,
  },
  customerMeta: {
    gap: 4,
    alignItems: 'flex-end',
  },
  metaBox: {
    minWidth: 150,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 6,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Table Section
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableHeaderCol: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  colDate: { width: '25%' },
  colMorning: { width: '25%', textAlign: 'center' },
  colEvening: { width: '25%', textAlign: 'center' },
  colTotal: { width: '25%', textAlign: 'right', fontWeight: 'bold' },

  // Monthly Insights (Bottom Left)
  bottomGrid: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 20,
  },
  insightsSection: {
    width: '60%',
  },
  insightsTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    color: '#1e293b',
  },
  milkStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
  },
  statLabel: {
    fontSize: 6,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalVolumeCard: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
  },
  // Summary Section (Bottom Right)
  summarySection: {
    width: '40%',
    backgroundColor: '#f8faff',
    borderRadius: 15,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  amountDueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  paymentButton: {
    backgroundColor: '#10b981', // Green from the image
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  paymentText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
    fontSize: 7,
    color: '#94a3b8',
  },
});

const CustomerInvoicePdfDocument = ({
  dairyName,
  customerName,
  customerPhone,
  customerAddress,
  invoiceId,
  customerId,
  billYear,
  billMonth,
  monthYear,
  records,
  totalPaid,
}: CustomerInvoicePdfProps) => {
  const daysInMonth = new Date(Date.UTC(billYear, billMonth, 0)).getUTCDate();
  const normalizedRecords = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return (
      records.find((record) => record.day === day) ?? {
        day,
        morningCow: 0,
        morningBuffalo: 0,
        eveningCow: 0,
        eveningBuffalo: 0,
      }
    );
  });

  const totalCow = normalizedRecords.reduce(
    (acc, r) => acc + r.morningCow + r.eveningCow,
    0,
  );
  const totalBuffalo = normalizedRecords.reduce(
    (acc, r) => acc + r.morningBuffalo + r.eveningBuffalo,
    0,
  );
  const totalVol = totalCow + totalBuffalo;
  const avgDaily = daysInMonth > 0 ? totalVol / daysInMonth : 0;

  const formatDateLabel = (day: number) => {
    if (day > daysInMonth) return `Day ${String(day).padStart(2, '0')}`;

    const date = new Date(Date.UTC(billYear, billMonth - 1, day));

    const monthDay = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    }).format(date);

    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(date);

    return `${monthDay}, ${weekday}`;
  };

  return (
    <Document>
      <Page size='A4' style={pdfStyles.page}>
        <View style={pdfStyles.card}>
          {/* Header */}
          <View style={pdfStyles.headerRow}>
            <View style={pdfStyles.brandGroup}>
              <View style={pdfStyles.logoIcon} />
              <View>
                <Text style={pdfStyles.brandName}>{dairyName}</Text>
                <Text style={pdfStyles.brandTagline}>
                  Pure Freshness Delivered
                </Text>
              </View>
            </View>
            <View style={pdfStyles.statementHeader}>
              <Text style={pdfStyles.statementTitle}>Monthly Statement</Text>
              <Text style={pdfStyles.statementMonth}>{monthYear}</Text>
              <Text style={pdfStyles.statementRef}>REF: {invoiceId}</Text>
            </View>
          </View>

          {/* Billed To */}
          <View style={pdfStyles.billedSection}>
            <View>
              <Text style={pdfStyles.billedLabel}>Customer Details</Text>
              <Text style={pdfStyles.customerName}>{customerName}</Text>
              <Text style={pdfStyles.customerAddress}>
                {customerAddress || '—'}
              </Text>
            </View>
            <View style={pdfStyles.customerMeta}>
              <Text style={pdfStyles.billedRightLabel}>Contact & Id</Text>
              <View style={pdfStyles.metaBox}>
                <Text style={pdfStyles.metaValue}>
                  Customer ID: {customerId}
                </Text>
              </View>
              <View style={pdfStyles.metaBox}>
                <Text style={pdfStyles.metaValue}>Phone: {customerPhone}</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderCol, pdfStyles.colDate]}>
              Date
            </Text>
            <Text style={[pdfStyles.tableHeaderCol, pdfStyles.colMorning]}>
              Morning (C/B)
            </Text>
            <Text style={[pdfStyles.tableHeaderCol, pdfStyles.colEvening]}>
              Evening (C/B)
            </Text>
            <Text style={[pdfStyles.tableHeaderCol, pdfStyles.colTotal]}>
              Daily Total
            </Text>
          </View>

          {normalizedRecords.map((record) => (
            <View key={record.day} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.colDate}>
                {formatDateLabel(record.day)}
              </Text>
              <Text style={pdfStyles.colMorning}>
                {record.morningCow.toFixed(1)}L /{' '}
                {record.morningBuffalo.toFixed(1)}L
              </Text>
              <Text style={pdfStyles.colEvening}>
                {record.eveningCow.toFixed(1)}L /{' '}
                {record.eveningBuffalo.toFixed(1)}L
              </Text>
              <Text style={pdfStyles.colTotal}>
                {(
                  record.morningCow +
                  record.eveningCow +
                  record.morningBuffalo +
                  record.eveningBuffalo
                ).toFixed(1)}{' '}
                L
              </Text>
            </View>
          ))}

          {/* Bottom Insights & Summary */}
          <View style={pdfStyles.bottomGrid}>
            <View style={pdfStyles.insightsSection}>
              <Text style={pdfStyles.insightsTitle}>Monthly Insights</Text>
              <View style={pdfStyles.milkStatsRow}>
                <View style={pdfStyles.statCard}>
                  <Text style={pdfStyles.statLabel}>Cow Milk Total</Text>
                  <Text style={pdfStyles.statValue}>
                    {totalCow.toFixed(1)} Ltrs
                  </Text>
                </View>
                <View style={pdfStyles.statCard}>
                  <Text style={pdfStyles.statLabel}>Buffalo Milk Total</Text>
                  <Text style={pdfStyles.statValue}>
                    {totalBuffalo.toFixed(1)} Ltrs
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.totalVolumeCard}>
                <View>
                  <Text style={{ fontSize: 7, textTransform: 'uppercase' }}>
                    Total Volume Delivered
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {totalVol.toFixed(1)} Liters
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 7, textTransform: 'uppercase' }}>
                    Avg Daily
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                    {avgDaily.toFixed(2)} L
                  </Text>
                </View>
              </View>
            </View>

            <View style={pdfStyles.summarySection}>
              <View style={pdfStyles.summaryRow}>
                <Text style={{ color: '#64748b' }}>Monthly Subtotal</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalPaid)}
                </Text>
              </View>
              <View style={pdfStyles.summaryRow}>
                <Text style={{ color: '#64748b' }}>Delivery Fee</Text>
                <Text style={{ color: '#10b981', fontWeight: 'bold' }}>
                  FREE
                </Text>
              </View>
              <View style={pdfStyles.amountDueRow}>
                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>
                  AMOUNT DUE
                </Text>
                <Text style={pdfStyles.amountDueValue}>
                  {formatCurrency(totalPaid)}
                </Text>
              </View>
              <View style={pdfStyles.paymentButton}>
                <Text style={pdfStyles.paymentText}>✔ Payment Completed</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CustomerInvoicePdfDocument;
