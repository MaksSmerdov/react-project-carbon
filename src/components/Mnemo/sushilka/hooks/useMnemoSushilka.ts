import { useEffect, useState } from "react";

interface Config {
  url: string; // Прямой URL для запроса данных
  objectNumber: number; // Номер объекта
}

interface Data {
  temperatures?: Record<string, number | string>;
  gorelka?: Record<string, number | string>;
  im?: Record<string, boolean>;
  vacuums?: Record<string, number | string>;
}

const useMnemoSushilka = ({ url, objectNumber }: Config) => {
  const [data, setData] = useState<Data>({}); // Данные с сервера
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false); // Включены ли тултипы
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Первая загрузка
  const [animationsRunning, setAnimationsRunning] = useState(false); // Анимации активны
  const [isGif2Visible, setIsGif2Visible] = useState(false); // Видимость GIF
  const [isGorelkaGifsVisible, setIsGorelkaGifsVisible] = useState(false); // Видимость GIF горелки

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isFirstLoad) setIsLoading(true); // Показываем загрузку при первой загрузке
        const response = await fetch(url); // Запрос к API
        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
        }
        const result = await response.json(); // Парсим JSON
        setData(result); // Обновляем данные
      } catch (error: any) {
        const errorMsg =
          error.name === "TypeError" && error.message.includes("Failed to fetch")
            ? `Ошибка: Не удалось подключиться к серверу. Проверьте подключение или URL: ${url}`
            : `Ошибка загрузки данных: ${error.message}`;
        console.error(errorMsg); // Логируем ошибку
      } finally {
        if (isFirstLoad) {
          setIsFirstLoad(false); // Завершаем первую загрузку
          setIsLoading(false); // Скрываем загрузку
        }
      }
    };

    fetchData(); // Первый запрос данных
    const interval = setInterval(fetchData, 5000); // Периодический запрос данных каждые 5 секунд
    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [url, isFirstLoad]);

  // Логика для управления анимациями и видимостью GIF
  useEffect(() => {
    const { temperatures, gorelka } = data;
    const temperature = temperatures?.["Температура уходящих газов"];
    const gorelkaPower = gorelka?.[`Мощность горелки №${objectNumber}`];

    // Включаем анимации, если температура больше 30
    setAnimationsRunning(!!(typeof temperature === "number" && temperature > 30));
    // Показываем GIF, если температура больше 30
    setIsGif2Visible(!!(typeof temperature === "number" && temperature > 30));
    // Показываем GIF горелки, если мощность больше 5
    setIsGorelkaGifsVisible(!!(typeof gorelkaPower === "number" && gorelkaPower > 5));
  }, [data, objectNumber]);

  // Переключение тултипов
  const toggleTooltips = () => setTooltipsEnabled((prev) => !prev);

  return {
    data, // Данные с сервера
    isLoading, // Состояние загрузки
    tooltipsEnabled, // Включены ли тултипы
    toggleTooltips, // Функция для переключения тултипов
    animationsRunning, // Анимации активны
    isGif2Visible, // Видимость GIF
    isGorelkaGifsVisible, // Видимость GIF горелки
  };
};

export default useMnemoSushilka;