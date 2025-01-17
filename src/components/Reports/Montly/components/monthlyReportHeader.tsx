import React from 'react';
import styles from '../monthlyReport.module.scss';
import CustomDatePicker from '../../../Common/DatePicker/datePicker';

interface ReportHeaderProps {
  selectedMonth: Date | null;
  onDateChange: (date: Date | null) => void;
}

const MonthlyReportHeader: React.FC<ReportHeaderProps> = ({ selectedMonth, onDateChange }) => {
  return (
    <>
      <div className={styles['dynamic-report__title-content']}>
        <h1 className={styles['dynamic-report__title']}>Отчёт по энергоресурсам производства CARBON</h1>
        <div className={styles['dynamic-report__date-range']}>
          <div className={styles['dynamic-report__date-div']}>
            <CustomDatePicker selectedDate={selectedMonth} handleDateChange={onDateChange} format="dd.MM.yyyy" />
          </div>
        </div>
      </div>
      <h3>
        Отчет за <span>{selectedMonth?.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
      </h3>
    </>
  );
};

export default MonthlyReportHeader;
