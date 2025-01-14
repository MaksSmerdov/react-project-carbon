import { useEffect, useState } from "react";
import { apiConfigs } from "../../../../configs/apiConfigSushilka";

type SushilkaKey = keyof typeof apiConfigs;

interface Config<K extends SushilkaKey> {
  config: typeof apiConfigs[K];
  objectNumber: number;
}

type Data<K extends SushilkaKey> = typeof apiConfigs[K]["defaultData"];

const useMnemoSushilka = <K extends SushilkaKey>({ config, objectNumber }: Config<K>) => {
  const [data, setData] = useState<Data<K>>(config.defaultData);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [animationsRunning, setAnimationsRunning] = useState(false);
  const [isGif2Visible, setIsGif2Visible] = useState(false);
  const [isGorelkaGifsVisible, setIsGorelkaGifsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isFirstLoad) setIsLoading(true);
        const response = await fetch(config.apiUrl);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        const errorMsg =
          error.name === "TypeError" && error.message.includes("Failed to fetch")
            ? `Ошибка: Не удалось подключиться к серверу. Проверьте подключение или URL: ${config.apiUrl}`
            : `Ошибка загрузки данных: ${error.message}`;
        console.error(errorMsg);
      } finally {
        if (isFirstLoad) {
          setIsFirstLoad(false);
          setIsLoading(false);
        }
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [config.apiUrl, isFirstLoad]);

  useEffect(() => {
    const { temperatures, gorelka } = data;
    const temperature = temperatures?.["Температура уходящих газов"];
    const gorelkaPower = gorelka?.[`Мощность горелки №${objectNumber}`];

    setAnimationsRunning(!!(typeof temperature === "number" && temperature > 30));
    setIsGif2Visible(!!(typeof temperature === "number" && temperature > 30));
    setIsGorelkaGifsVisible(!!(typeof gorelkaPower === "number" && gorelkaPower > 5));
  }, [data, objectNumber]);

  const toggleTooltips = () => setTooltipsEnabled((prev) => !prev);

  return {
    data,
    isLoading,
    tooltipsEnabled,
    toggleTooltips,
    animationsRunning,
    isGif2Visible,
    isGorelkaGifsVisible,
  };
};

export default useMnemoSushilka;
