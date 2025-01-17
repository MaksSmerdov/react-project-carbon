import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './dailyReport.module.scss';
import ReportHeader from './components/dailyReportHeader';
import ReportTable from './components/dailyReportTable';
import { formatDataByTimeSlot, calculateTotals, hasNoData } from './utils/dailyReportUtils';
import { getApiBaseUrl } from '../../../utils/apiUtils';

export interface ReportData {
  time: string;
  DE093: string;
  DD972: string;
  DD973: string;
  DD576: string;
  DD569: string;
  DD923: string;
  DD924: string;
}

const apiBaseUrl = getApiBaseUrl();

const ReportDaily: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportDate, setReportDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const updateReportDateHeader = useCallback((date: Date) => {
    const formattedDate = date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setReportDate(formattedDate);
  }, []);

  const loadDataForSelectedDate = useCallback(async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    setConnectionError(false);
    setReportData([]);

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${apiBaseUrl}/api/reportRoutes/getReportDataDay?date=${dateString}`);
      if (!response.ok) throw new Error('Ошибка соединения с сервером');

      let data = await response.json();
      const now = new Date();
      if (dateString === now.toISOString().split('T')[0]) {
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        data = data.filter((entry: ReportData) => {
          const [hour, minute] = entry.time === '24:00' ? [24, 0] : entry.time.split(':').map(Number);
          return (hour * 60 + minute) <= currentTimeInMinutes;
        });
      }

      setReportData(formatDataByTimeSlot(data));
      updateReportDateHeader(selectedDate);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, updateReportDateHeader]);

  useEffect(() => {
    loadDataForSelectedDate();
  }, [loadDataForSelectedDate]);

  useEffect(() => {
    if (tableContainerRef.current && reportData.length > 0 && !hasNoData(reportData)) {
      const table = tableContainerRef.current.querySelector('table');
      if (table) {
        const firstRow = table.querySelector('tbody tr');
        if (firstRow) {
          const rowHeight = firstRow.clientHeight;
          const headerHeight = table.querySelector('thead')?.clientHeight || 0;
          tableContainerRef.current.style.height = `${headerHeight + rowHeight * reportData.length}px`;
          return;
        }
      }
    }
    tableContainerRef.current?.style && (tableContainerRef.current.style.height = '300px');
  }, [reportData]);

  const totals = calculateTotals(reportData);
  const noData = reportData.length === 0 || hasNoData(reportData);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date || new Date()); 
  };
  
  return (
    <div className={styles.content}>
      <div className={styles['dynamic-report']}>
        <ReportHeader
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          reportDate={reportDate}
        />
        {connectionError ? (
          <div className={styles['error-message']}>Отсутствует связь с сервером.</div>
        ) : (
          <ReportTable reportData={reportData} totals={totals} noData={noData} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default ReportDaily;