import React, { useState } from 'react';
import styles from './chart.module.scss';
import { useInterval } from './context/intervalContext';
import Select from 'react-select';

const IntervalSelector: React.FC = () => {
  const { setInterval } = useInterval();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для управления видимостью меню
  const [menuOpacity, setMenuOpacity] = useState(0); // Состояние для управления opacity меню

  const options = [
    { value: 5, label: '5 минут' },
    { value: 10, label: '10 минут' },
    { value: 30, label: '30 минут' },
    { value: 60, label: '1 час' },
  ];

  const handleIntervalChange = (selectedOption: any) => {
    setInterval(selectedOption.value);
  };

  // Обработчик открытия меню
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    setTimeout(() => setMenuOpacity(1), 10); // Задержка для плавного появления
  };

  // Обработчик закрытия меню
  const handleMenuClose = () => {
    setMenuOpacity(0); // Сначала анимация исчезновения
    setTimeout(() => setIsMenuOpen(false), 300); // Задержка перед скрытием меню
  };

  return (
    <div className={styles['interval-selector']}>
      <span className={styles['interval-selector__label']}>Выбор интервала:</span>
      <Select
        options={options}
        onChange={handleIntervalChange}
        defaultValue={options[1]}
        classNamePrefix="react-select"
        isSearchable={false}
        onMenuOpen={handleMenuOpen} // Обработчик открытия меню
        onMenuClose={handleMenuClose} // Обработчик закрытия меню
        menuIsOpen={isMenuOpen} // Управление видимостью меню
        styles={{
          control: (provided) => ({
            ...provided,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: 'none',
            cursor: 'pointer',
            transition: 'box-shadow 0.5s ease',
            width: 'auto',
            minWidth: '125px', 
            '&:hover': {
              boxShadow: '0 0 4px 2px rgba(0, 128, 0, 0.5)',
              transition: 'box-shadow 0.5s ease',
            },
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'green' : 'white',
            color: state.isSelected ? 'white' : '#333',
            cursor: 'pointer',
            transition: 'background-color 0.5s ease, color 0.5s ease',
            '&:hover': {
              backgroundColor: 'lightgreen',
              color: '#333',
            },
          }),
          menu: (provided) => ({
            ...provided,
            marginTop: '5px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            opacity: menuOpacity, // Управление opacity меню
            transition: 'opacity 0.3s ease', // Анимация opacity
          }),
        }}
      />
    </div>
  );
};

export default IntervalSelector;