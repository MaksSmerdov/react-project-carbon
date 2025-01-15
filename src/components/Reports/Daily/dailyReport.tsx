import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button } from '@mui/material';
import styles from './dailyReport.module.scss';
import { ru } from 'date-fns/locale';
import Loader from '../../Common/Preloader/preloader';

interface ReportData {
  time: string;
  DE093: string;
  DD972: string;
  DD973: string;
  DD576: string;
  DD569: string;
  DD923: string;
  DD924: string;
}

const ReportDaily: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [reportDate, setReportDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Функция для обновления заголовка с датой отчета
  const updateReportDateHeader = (date: Date) => {
    const formattedDate = date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setReportDate(formattedDate);
  };

  // Функция для форматирования данных по временным слотам
  const formatDataByTimeSlot = (data: ReportData[]) => {
    return data.sort((a, b) => {
      const timeA = a.time === '24:00' ? [24, 0] : a.time.split(':').map(Number);
      const timeB = b.time === '24:00' ? [24, 0] : b.time.split(':').map(Number);
      return timeA[0] - timeB[0] || timeA[1] - timeB[1];
    });
  };

  // Функция для расчета итогов
  const calculateTotals = (data: ReportData[]) => {
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

  // Функция для загрузки данных
  const loadDataForSelectedDate = async () => {
    if (!selectedDate) {
      alert('Пожалуйста, выберите дату.');
      return;
    }

    setLoading(true);

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:3001/api/reportRoutes/getReportDataDay?date=${dateString}`);
      let data = await response.json();

      // Фильтрация данных, если выбранная дата — сегодня
      const now = new Date();
      if (dateString === now.toISOString().split('T')[0]) {
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        data = data.filter((entry: ReportData) => {
          const [hour, minute] = entry.time === '24:00' ? [24, 0] : entry.time.split(':').map(Number);
          const entryTimeInMinutes = hour * 60 + minute;
          return entryTimeInMinutes <= currentTimeInMinutes;
        });
      }

      const formattedData = formatDataByTimeSlot(data);
      setReportData(formattedData);
      updateReportDateHeader(selectedDate);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения даты
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Обработчик подтверждения даты
  const handleConfirmDate = () => {
    loadDataForSelectedDate();
  };

  // Расчет итогов
  const totals = calculateTotals(reportData);

  return (
    <div className={styles.content}>
      <div className={styles['dynamic-report']}>
        <div className={styles['dynamic-report__title-content']}>
          <h1 className={styles['dynamic-report__title']}>Отчёт по энергоресурсам к.10в1</h1>
          <div className={styles['dynamic-report__date-range']}>
            <div className={styles['dynamic-report__date-label']}>Выберите дату для просмотра архива отчета:</div>
            <div className={styles['dynamic-report__date-div']}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="dd.MM"
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      size: 'small',
                      className: styles['dynamic-report__date-input'],
                    },
                  }}
                />
              </LocalizationProvider>
              <Button variant="contained" onClick={handleConfirmDate} id="confirmDateBtn">
                Принять
              </Button>
            </div>
          </div>
        </div>

        {/* Заголовок для выбранной даты */}
        <h3>Отчет за <span id="reportDate">{reportDate}</span></h3>

        {/* Прелоудер */}
        {loading && (
        <Loader delay={1000} size={100} />
        )}

        {/* Таблица для вывода данных */}
        <div className={styles['dynamic-report__table']}>
          <table className={styles['dynamic-report__report-table']} id="reportTable">
            <thead>
              <tr>
                <th className={styles['dynamic-report__report-header']} rowSpan={2}>Время</th>
                <th className={styles['dynamic-report__report-header']} colSpan={3}>Расход пара, Гкал</th>
                <th className={styles['dynamic-report__report-header']} colSpan={4}>
                  Генерация пара от к.265 и котлов утилизаторов к.10в1, Гкал
                </th>
              </tr>
              <tr>
                <th className={styles['dynamic-report__report-header']}>МПА2</th>
                <th className={styles['dynamic-report__report-header']}>МПА3</th>
                <th className={styles['dynamic-report__report-header']}>МПА4</th>
                <th className={styles['dynamic-report__report-header']}>К10В1</th>
                <th className={styles['dynamic-report__report-header']}>К265</th>
                <th className={styles['dynamic-report__report-header']}>Котел Утил. №1</th>
                <th className={styles['dynamic-report__report-header']}>Котел Утил. №2</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((row, index) => (
                  <tr key={index}>
                    <td className={styles['dynamic-report__report-cell']}>{row.time}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DE093}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD972}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD973}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD576}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD569}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD923}</td>
                    <td className={styles['dynamic-report__report-cell']}>{row.DD924}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    Нет данных за выбранную дату.
                  </td>
                </tr>
              )}
              {/* Строка с итогами */}
              {reportData.length > 0 && (
                <tr>
                  <td className={styles['dynamic-report__report-cell']} style={{ fontWeight: 'bold', backgroundColor: 'green', color: 'white' }}>
                    Итого
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DE093.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD972.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD973.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD576.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD569.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD923.toFixed(2)}
                  </td>
                  <td className={styles['dynamic-report__report-cell']} style={{ backgroundColor: 'yellow' }}>
                    {totals.DD924.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportDaily;