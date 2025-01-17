import React, { useMemo } from 'react';
import styles from '../dailyReport.module.scss';
import Loader from '../../../Common/Preloader/preloader';

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
  noData: boolean;
  isLoading: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({ reportData, totals, noData, isLoading }) => {
  const renderTableHeader = useMemo(() => (
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
  ), []);

  const renderTableBody = useMemo(() => {
    if (noData) {
      return (
        <tr>
          <td colSpan={8} style={{ textAlign: 'center' }}>
            Нет данных за выбранную дату.
          </td>
        </tr>
      );
    }

    return (
      <>
        {reportData.map((row, index) => (
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
        ))}
        {reportData.length > 0 && (
          <tr>
            <td
              className={styles['dynamic-report__report-cell']}
              style={{ fontWeight: 'bold', backgroundColor: 'green', color: 'white' }}
            >
              Итого
            </td>
            {Object.values(totals).map((total, index) => (
              <td
                key={index}
                className={styles['dynamic-report__report-cell']}
                style={{ backgroundColor: 'yellow' }}
              >
                {total.toFixed(2)}
              </td>
            ))}
          </tr>
        )}
      </>
    );
  }, [noData, reportData, totals]);

  return (
    <div className={styles['dynamic-report__table']}>
      {isLoading && (
        <div className={styles['loader-overlay']}>
          <Loader size={80} fullPage={false} />
        </div>
      )}

      <table className={styles['dynamic-report__report-table']} id="reportTable">
        {renderTableHeader}
        <tbody>{renderTableBody}</tbody>
      </table>
    </div>
  );
};

export default React.memo(ReportTable);