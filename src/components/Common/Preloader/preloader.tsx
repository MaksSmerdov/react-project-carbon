import React, { useState, useEffect } from 'react';
import styles from './preloader.module.scss';

interface LoaderProps {
  delay?: number; // Задержка перед исчезновением прелоудера (в миллисекундах)
  size?: number; // Размер прелоудера
}

const Loader: React.FC<LoaderProps> = ({ delay = 1000, size = 60 }) => {
  const [isVisible, setIsVisible] = useState(true); // Состояние видимости прелоудера

  useEffect(() => {
    // Устанавливаем таймер для скрытия прелоудера через указанную задержку
    const timer = setTimeout(() => setIsVisible(false), delay);
    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, [delay]);

  // Если прелоудер не видим, возвращаем null
  if (!isVisible) return null;

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.reactLogo} style={{ width: size, height: size }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-11.5 -10.23174 23 20.46348"
          className={styles.reactSvg}
        >
          {/* Центральная точка */}
          <circle cx="0" cy="0" r="2.05" fill="black" className={styles.centerDot} />

          {/* Орбиты */}
          <g stroke="green" strokeWidth="1" fill="none" className={styles.orbit}>
            <ellipse rx="11" ry="4.2" className={styles.orbit1} />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" className={styles.orbit2} />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" className={styles.orbit3} />
          </g>
        </svg>
      </div>
      <p className={styles.loaderText}>Идет загрузка, пожалуйста подождите</p>
    </div>
  );
};

export default Loader;