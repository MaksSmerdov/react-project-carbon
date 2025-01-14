import { useState, useEffect, useCallback } from 'react';

export interface GenericReading {
  [key: string]: number; // Ключ — название параметра, значение — числовое измерение
}

export interface GenericData {
  lastUpdated: string; // Временная метка
  values: GenericReading; // Произвольные параметры
}

export const useData = (apiUrl: string, startTime: Date, endTime: Date) => {
  const [data, setData] = useState<GenericData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`
      );
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const result: GenericData[] = await response.json();
      setData(result);
      setError(null); // Сбрасываем ошибку при успешном запросе
    } catch (err) {
      console.error('Ошибка при запросе данных:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, startTime, endTime]);

  // Автоматический повторный запрос при ошибке
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (error) {
        fetchData(); // Повторяем запрос, если есть ошибка
      }
    }, 5000); // Интервал повторного запроса (например, каждые 5 секунд)

    return () => clearInterval(intervalId);
  }, [error, fetchData]);

  // Основной запрос данных
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
};