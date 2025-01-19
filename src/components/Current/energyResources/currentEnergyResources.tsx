import { useEffect, useState } from 'react';
import Header from '../../Common/Header/header';
import TableResources from '../../Common/Table/tableEnergyResources';
import { fetchEnergyData, TableRow } from '../../../configs/apiConfigEnergyResources'; // Импортируем функции и интерфейсы

const CurrentEnergyResources = () => {
  const [generationData, setGenerationData] = useState<TableRow[]>([]);
  const [consumptionData, setConsumptionData] = useState<TableRow[]>([]);

  // Функция для загрузки данных и обновления состояния
  const loadData = async () => {
    try {
      const { generation, consumption } = await fetchEnergyData();
      setGenerationData(generation);
      setConsumptionData(consumption);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      // Устанавливаем пустые данные в случае ошибки
      setGenerationData([]);
      setConsumptionData([]);
    }
  };

  // Загружаем данные каждые 5 секунд
  useEffect(() => {
    loadData(); // Первая загрузка данных
    const interval = setInterval(loadData, 5000); // Обновление каждые 5 секунд

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  return (
    <div>
      <Header title="Текущие параметры узлов учета пара" maxWidth="100%" />
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}> {/* Добавлен display: flex */}
      <TableResources title="Генерация пара" data={generationData} />
      <TableResources title="Потребление пара" data={consumptionData} />
      </div>
    </div>
  );
};

export default CurrentEnergyResources;