import React, { useState, useEffect, useCallback } from 'react';
import styles from './monthlyReport.module.scss';
import CustomModal from '../../Common/Modal/modal';
import PasswordForm from '../../Common/Password/passwordForm';
import MonthlyReportHeader from './components/monthlyReportHeader';
import MonthlyReportTable from './components/monthlyReportTable';
import {
  loadDataForSelectedMonth,
  calculateTotals,
  collectModifiedData,
  saveChanges,
} from './utils/monthlyReportUtils';
import { ReportData } from './utils/monthlyReportUtils';

const ReportMonthly: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [originalData, setOriginalData] = useState<ReportData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isNoChangesModalOpen, setIsNoChangesModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false); // Новое состояние для ошибки соединения
  const [totals, setTotals] = useState({
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  });

  useEffect(() => {
    const setCurrentMonth = () => {
      const today = new Date();
      setSelectedMonth(today);
    };

    setCurrentMonth();
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedMonth) return;

    setIsLoading(true);
    setErrorMessage('');
    setConnectionError(false); // Сбрасываем ошибку соединения перед загрузкой данных

    try {
      const data = await loadDataForSelectedMonth(selectedMonth);
      setReportData(data);
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setTotals(calculateTotals(data));
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setConnectionError(true); // Устанавливаем ошибку соединения
      setErrorMessage('Произошла ошибка при загрузке данных. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveChanges = () => {
    const modifications = collectModifiedData(reportData, originalData);

    if (modifications.length === 0) {
      setIsNoChangesModalOpen(true);
      return;
    }

    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      const modifications = collectModifiedData(reportData, originalData);
      await saveChanges(modifications, password);
      await fetchData();
      setIsPasswordModalOpen(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Произошла ошибка при сохранении.');
      } else {
        setErrorMessage('Произошла ошибка при сохранении.');
      }
    }
  };

  const handleInputChange = (index: number, field: keyof ReportData, value: string) => {
    const newData = [...reportData];
    newData[index][field] = value;
    setReportData(newData);
    setTotals(calculateTotals(newData));
  };

  return (
    <div className={styles.content}>
      <div className={styles['dynamic-report']}>
        <MonthlyReportHeader selectedMonth={selectedMonth} onDateChange={setSelectedMonth} />
        {connectionError ? ( // Отображаем сообщение об ошибке, если connectionError === true
          <div className={styles['error-message']}>Отсутствует связь с сервером.</div>
        ) : (
          <MonthlyReportTable
            reportData={reportData}
            totals={totals}
            isLoading={isLoading}
            onSaveChanges={handleSaveChanges}
            onInputChange={handleInputChange}
          />
        )}
      </div>

      <CustomModal
        isOpen={isPasswordModalOpen}
        title="Коррекция параметров"
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <PasswordForm onConfirm={handlePasswordConfirm} errorMessage={errorMessage} onError={setErrorMessage} />
      </CustomModal>

      <CustomModal
        isOpen={isNoChangesModalOpen}
        title="Коррекция параметров"
        onClose={() => setIsNoChangesModalOpen(false)}
      >
        <p style={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }}>
          Изменений не было. Введите коррекцию!!!
        </p>
      </CustomModal>
    </div>
  );
};

export default ReportMonthly;
