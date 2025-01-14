import React from "react";
import styles from "./table.module.scss";

interface TableProps {
  title: string;
  items: Record<string, string | number>;
  displayNames: Record<string, string>;
  width?: string; // Новый проп для max-width
}

const Table: React.FC<TableProps> = ({ title, items, displayNames, width = "100%" }) => (
  <table className={styles.table} style={{ width }}>
    <caption className={styles.table__title}>{title}</caption>
    <thead className={styles.table__thead}>
      <tr className={styles.table__tr}>
        <th className={`${styles.table__th} ${styles.table__left}`}>Наименование параметра</th>
        <th className={styles.table__th}>Значение</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(items).map(([name, value], index) => (
        <tr key={`${name}-${index}`} className={styles.table__tr}>
          <td className={`${styles.table__td} ${styles.table__left}`}>
            {displayNames[name] || name}
          </td>
          <td className={`${styles.table__td} ${styles.table__right}`}>{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
