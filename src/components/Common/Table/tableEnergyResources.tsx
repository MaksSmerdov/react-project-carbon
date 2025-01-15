import React from 'react';
import styles from './scss/tableEnergyResources.module.scss'; // Импортируем стили

interface TableRow {
  name: string;
  size: string;
  heat: string | number;
  volume: string | number;
  mass: string | number;
  pressure: string | number;
  temperature: string | number;
}

interface TableProps {
  title: string;
  data: TableRow[];
}

const Table: React.FC<TableProps> = ({ title, data }) => {
  return (
    <table className={styles.table}>
      <caption className={styles.table__title}>{title}</caption>
      <thead className={styles.table__thead}>
        <tr className={styles.table__tr}>
          <th className={styles.table__th}>Наименование узла учета</th>
          <th className={styles.table__th}>Типоразмер</th>
          <th className={styles.table__th}>Теплота, гкал/час</th>
          <th className={styles.table__th}>Объем, м3/час</th>
          <th className={styles.table__th}>Масса, т/час</th>
          <th className={styles.table__th}>Давление, МПа</th>
          <th className={styles.table__th}>Температура, °C</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: TableRow, index: number) => (
          <tr key={index} className={styles.table__tr}>
            <td className={`${styles.table__td} ${styles['table__left']}`}>{row.name}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.size}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.heat}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.volume}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.mass}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.pressure}</td>
            <td className={`${styles.table__td} ${styles['table__right']}`}>{row.temperature}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;