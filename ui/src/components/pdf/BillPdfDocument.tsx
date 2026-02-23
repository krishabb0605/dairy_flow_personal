import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import type { BillPdfProps } from '../../types';

const pdfStyles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    color: '#0f172a',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 12,
    color: '#64748b',
  },
  headerGrid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  headerBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 6,
  },
  headerLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  headerValue: {
    fontSize: 10,
    fontWeight: 600,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9',
    fontWeight: 700,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  cellDay: {
    width: '12%',
    padding: 4,
    textAlign: 'center',
  },
  cellQty: {
    width: '22%',
    padding: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },
  lineText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  highlightBox: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1d4ed8',
  },
});

const BillPdfDocument = ({
  customerName,
  customerPhone,
  customerId,
  monthYear,
  records,
  cowRate,
  buffaloRate,
  totalMorningCow,
  totalMorningBuffalo,
  totalEveningCow,
  totalEveningBuffalo,
  grandTotal,
}: BillPdfProps) => (
  <Document>
    <Page size='A4' style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Monthly Milk Record</Text>
      <Text style={pdfStyles.subtitle}>Digital Delivery Tracking Card</Text>

      <View style={pdfStyles.headerGrid}>
        <View style={pdfStyles.headerBox}>
          <Text style={pdfStyles.headerLabel}>Customer Name</Text>
          <Text style={pdfStyles.headerValue}>{customerName}</Text>
        </View>
        <View style={pdfStyles.headerBox}>
          <Text style={pdfStyles.headerLabel}>Mobile Number</Text>
          <Text style={pdfStyles.headerValue}>{customerPhone}</Text>
        </View>
        <View style={pdfStyles.headerBox}>
          <Text style={pdfStyles.headerLabel}>Customer ID</Text>
          <Text style={pdfStyles.headerValue}>{customerId}</Text>
        </View>
        <View style={pdfStyles.headerBox}>
          <Text style={pdfStyles.headerLabel}>Month & Year</Text>
          <Text style={pdfStyles.headerValue}>{monthYear}</Text>
        </View>
      </View>

      <View style={pdfStyles.tableHeader}>
        <Text style={pdfStyles.cellDay}>Day</Text>
        <Text style={pdfStyles.cellQty}>Morning Cow</Text>
        <Text style={pdfStyles.cellQty}>Morning Buf</Text>
        <Text style={pdfStyles.cellQty}>Evening Cow</Text>
        <Text style={pdfStyles.cellQty}>Evening Buf</Text>
      </View>
      {records.map((record) => (
        <View style={pdfStyles.row} key={record.day}>
          <Text style={pdfStyles.cellDay}>{record.day}</Text>
          <Text style={pdfStyles.cellQty}>{record.morningCow.toFixed(1)}</Text>
          <Text style={pdfStyles.cellQty}>
            {record.morningBuffalo.toFixed(1)}
          </Text>
          <Text style={pdfStyles.cellQty}>{record.eveningCow.toFixed(1)}</Text>
          <Text style={pdfStyles.cellQty}>
            {record.eveningBuffalo.toFixed(1)}
          </Text>
        </View>
      ))}

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Totals (Liters)</Text>
        <Text style={pdfStyles.lineText}>
          Morning Cow: {totalMorningCow.toFixed(1)} L, Morning Buffalo:{' '}
          {totalMorningBuffalo.toFixed(1)} L, Evening Cow:{' '}
          {totalEveningCow.toFixed(1)} L, Evening Buffalo:{' '}
          {totalEveningBuffalo.toFixed(1)} L
        </Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Rate Settings</Text>
        <Text style={pdfStyles.lineText}>
          Cow Rate: {cowRate.toFixed(2)} per liter, Buffalo Rate:{' '}
          {buffaloRate.toFixed(2)} per liter
        </Text>
        <View style={pdfStyles.highlightBox}>
          <Text style={pdfStyles.highlightText}>
            Monthly Grand Total: {grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default BillPdfDocument;
