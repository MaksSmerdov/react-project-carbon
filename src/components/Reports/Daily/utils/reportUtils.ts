import { ReportData } from "../dailyReport";

export const formatDataByTimeSlot = (data: ReportData[]) => {
  return data.sort((a, b) => {
    const timeA = a.time === '24:00' ? [24, 0] : a.time.split(':').map(Number);
    const timeB = b.time === '24:00' ? [24, 0] : b.time.split(':').map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });
};

export const calculateTotals = (data: ReportData[]) => {
  const totals = {
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  };

  data.forEach((item) => {
    totals.DE093 += item.DE093 === '-' ? 0 : parseFloat(item.DE093);
    totals.DD972 += item.DD972 === '-' ? 0 : parseFloat(item.DD972);
    totals.DD973 += item.DD973 === '-' ? 0 : parseFloat(item.DD973);
    totals.DD576 += item.DD576 === '-' ? 0 : parseFloat(item.DD576);
    totals.DD569 += item.DD569 === '-' ? 0 : parseFloat(item.DD569);
    totals.DD923 += item.DD923 === '-' ? 0 : parseFloat(item.DD923);
    totals.DD924 += item.DD924 === '-' ? 0 : parseFloat(item.DD924);
  });

  return totals;
};

export const hasNoData = (data: ReportData[]) => {
  return data.every((item) => {
    return (
      item.DE093 === '-' &&
      item.DD972 === '-' &&
      item.DD973 === '-' &&
      item.DD576 === '-' &&
      item.DD569 === '-' &&
      item.DD923 === '-' &&
      item.DD924 === '-'
    );
  });
};