import React, { useEffect, useState } from 'react';
import styles from './kranComponent.module.scss';

interface KranProps {
  size?: { width: number; height: number };
  adaptiveSize?: { width: number; height: number };
  status: boolean;
  reverseColorLogic?: boolean; // Обратная логика цвета
  orientation?: 'horizontal' | 'vertical';
  top?: string;
  left?: string;
  adaptiveTop?: string;
  adaptiveLeft?: string;
}

const Kran: React.FC<KranProps> = ({
  size = { width: 40, height: 34 },
  adaptiveSize = { width: 20, height: 20 },
  status,
  reverseColorLogic = false,
  orientation = 'vertical',
  top = '0px',
  left = '0px',
  adaptiveTop = '50px',
  adaptiveLeft = '20px',
}) => {
  const [dynamicSize, setDynamicSize] = useState(size);
  const [position, setPosition] = useState({ top, left });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) {
        setDynamicSize(adaptiveSize);
        setPosition({ top: adaptiveTop, left: adaptiveLeft });
      } else {
        setDynamicSize(size);
        setPosition({ top, left });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [size, adaptiveSize, top, left, adaptiveTop, adaptiveLeft]);

  const [color, setColor] = useState<string>(reverseColorLogic ? (status ? 'red' : 'green') : status ? 'green' : 'red');

  useEffect(() => {
    setColor(reverseColorLogic ? (status ? 'red' : 'green') : status ? 'green' : 'red');
  }, [status, reverseColorLogic]);

  const transformStyle = orientation === 'horizontal' ? { transform: 'rotate(90deg)' } : {};

  const triangleHeight = dynamicSize.height / 2;

  return (
    <div
      className={styles['mnemo__kran']}
      style={{
        ...transformStyle,
        width: dynamicSize.width,
        height: dynamicSize.height,
        position: 'absolute',
        top: position.top,
        left: position.left,
      }}
    >
      <div className={styles['mnemo__kran-box']}>
        <div
          className={styles['mnemo__triangle1']}
          style={{
            borderTop: `${triangleHeight}px solid transparent`,
            borderLeft: `${dynamicSize.width / 2}px solid ${color}`,
            borderBottom: `${triangleHeight}px solid transparent`,
          }}
        />
        <div
          className={styles['mnemo__triangle2']}
          style={{
            borderTop: `${triangleHeight}px solid transparent`,
            borderRight: `${dynamicSize.width / 2}px solid ${color}`,
            borderBottom: `${triangleHeight}px solid transparent`,
          }}
        />
      </div>
    </div>
  );
};

export default Kran;
