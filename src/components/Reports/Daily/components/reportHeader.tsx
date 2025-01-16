import React from 'react';
import styles from '../dailyReport.module.scss';
import CustomDatePicker from '../../../Common/DatePicker/datePicker';

interface ReportHeaderProps {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  reportDate: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ selectedDate, handleDateChange, reportDate }) => {
  return (
    <>
      <div className={styles['dynamic-report__title-content']}>
        <h1 className={styles['dynamic-report__title']}>Отчёт по энергоресурсам к.10в1</h1>
        <div className={styles['dynamic-report__date-range']}>
          <div className={styles['dynamic-report__date-div']}>
            <CustomDatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} />
          </div>
        </div>
      </div>
      <h3>
        Отчет за <span id="reportDate">{reportDate}</span>
      </h3>
    </>
  );
};

export default ReportHeader;