import React, { useState } from "react";
import styles from "./monthlyReport.module.scss"; // Импорт стилей
import CustomModal from "../../Common/Modal/modal"; // Импорт готового компонента модалки
import PasswordForm from "../../Common/Password/passwordForm";

const ReportPage: React.FC = () => {
  // Состояния
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isNoChangesModalOpen, setIsNoChangesModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");


  // Заглушка данных для таблицы
  const [reportData, setReportData] = useState<
    Array<{
      time: string;
      mpa2: number;
      mpa3: number;
      mpa4: number;
      k10v1: number;
      k265: number;
      util1: number;
      util2: number;
    }>
  >([]);

  // Обработчики событий
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleConfirmMonth = () => {
    if (selectedMonth) {
      // Заглушка для загрузки данных
      setReportData([
        {
          time: "00:00",
          mpa2: 10,
          mpa3: 15,
          mpa4: 20,
          k10v1: 5,
          k265: 8,
          util1: 3,
          util2: 4,
        },
      ]);
    }
  };

  const handleSaveChanges = () => {
    setIsPasswordModalOpen(true);
  };

  // Обработчик подтверждения пароля
  const handlePasswordConfirm = (password: string) => {
    if (password === "correctPassword") {
      setIsPasswordModalOpen(false);
      setErrorMessage("");
      // Логика сохранения изменений
    } else {
      setErrorMessage("Неверный пароль");
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles["dynamic-report"]}>
        {/* Заголовок и выбор месяца */}
        <div className={styles["dynamic-report__title-content"]}>
          <h1 className={styles["dynamic-report__title"]}>Отчёт по энергоресурсам производства CARBON</h1>
          <div className={styles["dynamic-report__date-range"]}>
            <div className={styles["dynamic-report__date-label"]}>
              Выберите месяц для просмотра архива отчета:
            </div>
            <div className={styles["dynamic-report__date-div"]}>
              <input
                className={styles["dynamic-report__date-input"]}
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
              <button className={styles["dynamic-report__btn"]} onClick={handleConfirmMonth}>
                Принять
              </button>
            </div>
          </div>
        </div>

        {/* Отображение выбранного месяца */}
        <h3>Отчет за <span>{selectedMonth}</span></h3>

        {/* Таблица с данными */}
        <div className={styles["dynamic-report__table"]}>
          <table className={styles["dynamic-report__report-table"]}>
            <thead>
              <tr>
                <th className={styles["dynamic-report__report-header"]} rowSpan={2}>
                  Время
                </th>
                <th className={styles["dynamic-report__report-header"]} colSpan={3}>
                  Расход пара, Гкал
                </th>
                <th className={styles["dynamic-report__report-header"]} colSpan={4}>
                  Генерация пара от к.265 и котлов утилизаторов к.10в1, Гкал
                </th>
              </tr>
              <tr>
                <th className={styles["dynamic-report__report-header"]}>МПА2</th>
                <th className={styles["dynamic-report__report-header"]}>МПА3</th>
                <th className={styles["dynamic-report__report-header"]}>МПА4</th>
                <th className={styles["dynamic-report__report-header"]}>К10В1</th>
                <th className={styles["dynamic-report__report-header"]}>К265</th>
                <th className={styles["dynamic-report__report-header"]}>Котел Утил. №1</th>
                <th className={styles["dynamic-report__report-header"]}>Котел Утил. №2</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.time}</td>
                  <td>{row.mpa2}</td>
                  <td>{row.mpa3}</td>
                  <td>{row.mpa4}</td>
                  <td>{row.k10v1}</td>
                  <td>{row.k265}</td>
                  <td>{row.util1}</td>
                  <td>{row.util2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Кнопка сохранения изменений */}
        <div className={styles["dynamic-report__btn-save"]}>
          <button className={styles["dynamic-report__btn"]} onClick={handleSaveChanges}>
            Сохранить изменения по коррекции
          </button>
        </div>
      </div>

      {/* Модальное окно для ввода пароля */}
      <CustomModal
        isOpen={isPasswordModalOpen}
        title="Коррекция параметров"
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <PasswordForm
          onConfirm={handlePasswordConfirm}
          correctPassword="correctPassword"
          errorMessage={errorMessage}
          onError={setErrorMessage}
        />
      </CustomModal>

      {/* Модальное окно, если изменений нет */}
      <CustomModal
        isOpen={isNoChangesModalOpen}
        title="Коррекция параметров"
        onClose={() => setIsNoChangesModalOpen(false)}
      >
        <p>Изменений не было. Введите коррекцию!!!</p>
      </CustomModal>
    </div>
  );
};

export default ReportPage;