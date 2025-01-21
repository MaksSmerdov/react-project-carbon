import { useState, useEffect, useCallback } from 'react';

export interface GenericReading {
  [key: string]: number; // Ключ — название параметра, значение — числовое измерение
}

export interface GenericData {
  lastUpdated: string; // Временная метка
  values: GenericReading; // Произвольные параметры
}

export interface DatasetConfig {
  apiUrl: string;
  dataKey: string;
  params: { key: string; label: string; unit?: string }[];
}

export const useData = (configs: DatasetConfig[], startTime: Date, endTime: Date) => {
  const [data, setData] = useState<GenericData[][]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const abortController = new AbortController();
    setIsLoading(true);
    try {
      const results = await Promise.all(
        configs.map(async (config) => {
          const response = await fetch(`${config.apiUrl}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`,  { 
            signal: abortController.signal 
          });
          if (!response.ok) {
            throw new Error('Ошибка при получении данных');
          }
          return response.json();
        })
      );

      setData(results);
      setError(null); // Сбрасываем ошибку при успешном запросе
    } catch (err) {
      console.error('Ошибка при запросе данных:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
    return () => abortController.abort();
  }, [configs, startTime, endTime]);

  // Автоматический повторный запрос при ошибке
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (error) {
        fetchData(); // Повторяем запрос, если есть ошибка
      }
    }, 10000); // Интервал повторного запроса (например, каждые 5 секунд)

    return () => clearInterval(intervalId);
  }, [error, fetchData]);

  // Основной запрос данных
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
};