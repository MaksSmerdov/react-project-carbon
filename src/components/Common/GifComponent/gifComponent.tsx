import React from 'react';

// Определяем интерфейс для пропсов
interface GifComponentProps {
  src: string; // URL изображения IMG
  alt: string; // Альтернативный текст для изображения
  className: string; // CSS-классы для стилизации изображения
  data: { [key: string]: string | number }; // Объект с данными, где ключи - строки, а значения - строки или числа
  objectNumber: number; // Номер объекта, который может использоваться для идентификации
  conditionKey: string; // Ключ для доступа к значению в объекте данных
  isAnimation?: boolean; // Флаг, указывающий, должна ли анимация быть включена (по умолчанию false)
}

const GifComponent: React.FC<GifComponentProps> = ({
  src,
  alt,
  className,
  data,
  objectNumber,
  conditionKey,
  isAnimation = false,
}) => {
  const condition = data && data[conditionKey] && data[conditionKey] !== '—'; // Условие, если данные существуют и не равны "—"

  return (
    <img
      src={src}
      alt={alt}
      className={`${className}`}
      style={{
        display: isAnimation || condition ? 'block' : 'none', // Если isAnimation включено, display всегда block
        animationPlayState: condition ? 'running' : 'paused', // Состояние анимации зависит от condition
      }}
    />
  );
};

export default GifComponent;

