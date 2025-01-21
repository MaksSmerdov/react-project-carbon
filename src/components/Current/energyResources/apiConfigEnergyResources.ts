import { getApiBaseUrl } from "../../../utils/apiUtils";

export interface TableRow {
  name: string;
  size: string;
  heat: string | number;
  volume: string | number;
  mass: string | number;
  pressure: string | number;
  temperature: string | number;
}

// Интерфейс для данных API
export interface ApiData {
  [key: string]: {
    device: string;
    data: {
      [key: string]: number;
    };
  };
}

// Базовый URL API
const apiBaseUrl = getApiBaseUrl(); // Получаем базовый URL

// Конфигурация для генерации строк таблицы
const generationConfig = [
  { name: 'УТВХ от к.265 магистраль', size: 'Dy 150', key: 'dd569', prefix: 'DD569' },
  { name: 'Carbon к. 10в1 общий коллектор', size: 'Dy 150', key: 'dd576', prefix: 'DD576' },
  { name: 'Котел утилизатор №1', size: 'Dy 100', key: 'dd923', prefix: 'DD923' },
  { name: 'Котел утилизатор №2', size: 'Dy 100', key: 'dd924', prefix: 'DD924' },
];

const consumptionConfig = [
  { name: 'МПА №2', size: 'Dy 80', key: 'de093', prefix: 'DE093' },
  { name: 'МПА №3', size: 'Dy 80', key: 'dd972', prefix: 'DD972' },
  { name: 'МПА №4', size: 'Dy 80', key: 'dd973', prefix: 'DD973' },
];

// Функция для создания строки таблицы
const createTableRow = (
  name: string,
  size: string,
  deviceData: { [key: string]: number } | undefined,
  prefix: string
): TableRow => {
  const getValueOrDash = (value: number | undefined) => (value !== undefined ? value : '—');

  return {
    name,
    size,
    heat: getValueOrDash(deviceData?.[`Гкал/ч ${prefix}`]),
    volume: getValueOrDash(deviceData?.[`Куб/ч ${prefix}`]),
    mass: getValueOrDash(deviceData?.[`Тонн/ч ${prefix}`]),
    pressure: getValueOrDash(deviceData?.[`Давление ${prefix}`]),
    temperature: getValueOrDash(deviceData?.[`Температура ${prefix}`]),
  };
};

// Функция для создания пустой строки таблицы
const createEmptyRow = (name: string, size: string): TableRow => ({
  name,
  size,
  heat: '—',
  volume: '—',
  mass: '—',
  pressure: '—',
  temperature: '—',
});

// Функция для загрузки данных из API
export const fetchEnergyData = async (): Promise<{
  generation: TableRow[];
  consumption: TableRow[];
}> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/uzliUchetaCarbon`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data: ApiData = await response.json();

    // Генерация данных для таблицы
    const generation = generationConfig.map(({ name, size, key, prefix }) =>
      createTableRow(name, size, data[key]?.data, prefix)
    );

    const consumption = consumptionConfig.map(({ name, size, key, prefix }) =>
      createTableRow(name, size, data[key]?.data, prefix)
    );

    return { generation, consumption };
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);

    // Возвращаем таблицы с прочерками, если данные не загрузились
    const generation = generationConfig.map(({ name, size }) => createEmptyRow(name, size));
    const consumption = consumptionConfig.map(({ name, size }) => createEmptyRow(name, size));

    return { generation, consumption };
  }
};