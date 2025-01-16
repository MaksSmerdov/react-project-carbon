import { useState, useEffect, useCallback } from 'react';

export interface GenericReading {
  [key: string]: number; // Ключ — название параметра, значение — числовое измерение
}

export interface GenericData {
  lastUpdated: string; // Временная метка
  values: GenericReading; // Произвольные параметры
}

export const useData = (apiUrls: string | string[], startTime: Date, endTime: Date) => {
  const [data, setData] = useState<GenericData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Если apiUrls — строка, преобразуем её в массив
      const urls = Array.isArray(apiUrls) ? apiUrls : [apiUrls];

      // Выполняем все запросы параллельно
      const responses = await Promise.all(
        urls.map(url =>
          fetch(`${url}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`)
        )
      );

      // Проверяем статус каждого ответа
      const errors = responses.filter(response => !response.ok);
      if (errors.length > 0) {
        throw new Error('Ошибка при получении данных');
      }

      // Парсим JSON из всех ответов
      const results: GenericData[][] = await Promise.all(responses.map(res => res.json()));

      // Объединяем данные из всех API в один массив
      const combinedData = results.flat();
      setData(combinedData);
      setError(null); // Сбрасываем ошибку при успешном запросе
    } catch (err) {
      console.error('Ошибка при запросе данных:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrls, startTime, endTime]);

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