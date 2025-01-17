import React, { useCallback } from 'react';
import styles from '../monthlyReport.module.scss';
import Loader from '../../../Common/Preloader/preloader';
import { ReportData } from '../utils/monthlyReportUtils';

interface ReportTableProps {
  reportData: ReportData[];
  totals: {
    DE093: number;
    DD972: number;
    DD973: number;
    DD576: number;
    DD569: number;
    DD923: number;
    DD924: number;
  };
  isLoading: boolean;
  onSaveChanges: () => void;
  onInputChange: (index: number, field: keyof ReportData, value: string) => void;
}

const MonthlyReportTable: React.FC<ReportTableProps> = ({
  reportData,
  totals,
  isLoading,
  onSaveChanges,
  onInputChange,
}) => {
  const renderInputCell = useCallback(
    (index: number, field: keyof ReportData, value: string | number) => (
      <td className={styles['dynamic-report__report-cell']}>
        <input
          type="number"
          value={value}
          onChange={(e) => onInputChange(index, field, e.target.value)}
          className={styles['dynamic-report__report-input']}
        />
      </td>
    ),
    [onInputChange]
  );

  return (
    <div className={styles['dynamic-report__table']}>
      {isLoading && (
        <div className={styles['loader-overlay']}>
          <Loader size={80} fullPage={false} />
        </div>
      )}

      <table className={styles['dynamic-report__report-table']}>
        <thead>
          <tr>
            <th className={styles['dynamic-report__report-header']} rowSpan={2}>
              Время
            </th>
            <th className={styles['dynamic-report__report-header']} colSpan={3}>
              Расход пара, Гкал
            </th>
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
          {reportData.map((row, index) => (
            <tr key={index} className={styles['dynamic-report__report-tr']}>
              <td className={styles['dynamic-report__report-cell']}>{row.day}</td>
              {renderInputCell(index, 'DE093', row.DE093)}
              {renderInputCell(index, 'DD972', row.DD972)}
              {renderInputCell(index, 'DD973', row.DD973)}
              {renderInputCell(index, 'DD576', row.DD576)}
              {renderInputCell(index, 'DD569', row.DD569)}
              {renderInputCell(index, 'DD923', row.DD923)}
              {renderInputCell(index, 'DD924', row.DD924)}
            </tr>
          ))}
          {reportData.length === 0 && !isLoading && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                Нет данных за выбранный месяц.
              </td>
            </tr>
          )}
          <tr>
            <td style={{ fontWeight: 'bold', backgroundColor: 'green', color: 'white', textAlign: 'center' }}>
              Итого:
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DE093.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD972.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD973.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD576.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD569.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD923.toFixed(2)}
            </td>
            <td style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>
              {totals.DD924.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {!isLoading && (
        <div className={styles['dynamic-report__btn-save']}>
          <button
            className={`${styles['dynamic-report__btn']} ${isLoading ? styles['hidden'] : ''}`}
            onClick={onSaveChanges}
          >
            Сохранить изменения по коррекции
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(MonthlyReportTable);