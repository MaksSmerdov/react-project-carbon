import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import styles from './chart.module.scss';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import CrosshairPlugin from 'chartjs-plugin-crosshair';
import { useData } from './hooks/useData';
import { getChartOptions, colors } from './config/chartConfig';
import { handleBackward, handleForward, handleReturnToCurrent, createDataWithGaps } from './utils/chartUtils';
import IntervalSelector from './intervalSelector';
import { useInterval } from './context/intervalContext';
import { getApiBaseUrl } from '../../utils/apiUtils';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  CrosshairPlugin
);

interface UniversalChartProps {
  apiUrls: string | string[]; // Может быть строкой или массивом строк
  title: string;
  yMin?: number;
  yMax?: number;
  dataKey: string;
  params: { key: string; label: string; unit?: string }[];
  width?: number | string;
  height?: number | string;
  id: string;
  showIntervalSelector?: boolean;
  animationEnabled?: boolean; // Новый пропс для управления анимацией
}

interface GenericData {
  lastUpdated: string;
  [key: string]: any;
}

const apiBaseUrl = getApiBaseUrl();

const fetchServerTime = async (): Promise<number> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/server-time`);
    const data = await response.json();
    const serverTime = new Date(data.time).getTime();
    const clientTime = Date.now();
    return serverTime - clientTime;
  } catch (error) {
    console.error('Ошибка при получении времени сервера:', error);
    return 0;
  }
};

const UniversalChart: React.FC<UniversalChartProps> = ({
  apiUrls,
  title,
  yMin,
  yMax,
  dataKey,
  params,
  width = '100%',
  height = '400px',
  id,
  showIntervalSelector = true,
  animationEnabled = true, // Значение по умолчанию true
}) => {
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const chartRef = useRef<ChartJS<'line'> | null>(null);
  const { interval } = useInterval();
  const [startTime, setStartTime] = useState(new Date(Date.now() - interval * 60 * 1000));
  const [endTime, setEndTime] = useState(new Date());
  const { data, error, refetch } = useData(apiUrls, startTime, endTime);
  const [allHidden, setAllHidden] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    fetchServerTime().then((difference) => {
      setTimeDifference(difference);
    });
  }, []);

  const getAdjustedTime = useCallback((): Date => {
    return new Date(Date.now() + timeDifference);
  }, [timeDifference]);

  useEffect(() => {
    const newEndTime = new Date(getAdjustedTime().getTime() - timeOffset);
    const newStartTime = new Date(newEndTime.getTime() - interval * 60 * 1000);
    setEndTime(newEndTime);
    setStartTime(newStartTime);
  }, [interval, timeOffset, timeDifference, getAdjustedTime]);

  const processedData = useMemo(() => data.map((item: GenericData) => ({
    time: new Date(item.lastUpdated),
    values: item[dataKey] || {},
  })), [data, dataKey]);

  const chartData = useMemo(() => ({
    labels: processedData.map((d) => d.time),
    datasets: params.map((param, index) => ({
      label: param.label,
      data: createDataWithGaps(processedData, param.key),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      spanGaps: false,
    })),
  }), [processedData, params]);

  const options = useMemo(() => getChartOptions(
    startTime.getTime(),
    endTime.getTime(),
    title,
    isAutoScroll,
    params,
    yMin,
    yMax,
    animationEnabled // Передаем значение пропса в настройки графика
  ), [startTime, endTime, title, isAutoScroll, params, yMin, yMax, animationEnabled]);

  const handleBackwardWithInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    const newOffset = timeOffset + interval * 60 * 1000;
    setTimeOffset(newOffset);
    handleBackward(startTime, endTime, setStartTime, setEndTime, setIsAutoScroll);
  }, [startTime, endTime, interval, timeOffset]);

  const handleForwardWithInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    const newOffset = Math.max(0, timeOffset - interval * 60 * 1000);
    setTimeOffset(newOffset);
    handleForward(startTime, endTime, setStartTime, setEndTime, setIsAutoScroll);
  }, [startTime, endTime, interval, timeOffset]);

  const handleReturnToCurrentWithInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    setTimeOffset(0);
    handleReturnToCurrent(setStartTime, setEndTime, setIsAutoScroll, interval);
  }, [interval]);

  const handleToggleDataset = useCallback((index: number) => {
    if (chartRef.current) {
      const meta = chartRef.current.getDatasetMeta(index);
      meta.hidden = !meta.hidden;
      chartRef.current.update('none'); // Обновляем без анимации
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.data.datasets.forEach((_, index) => {
        const meta = chartRef.current?.getDatasetMeta(index);
        if (meta) {
          meta.hidden = !allHidden;
        }
      });
      chartRef.current.update('none'); // Обновляем без анимации
    }
    setAllHidden(!allHidden);
  }, [allHidden]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAutoScroll) {
        const newEndTime = new Date(getAdjustedTime().getTime() - timeOffset);
        const newStartTime = new Date(newEndTime.getTime() - interval * 60 * 1000);
        setEndTime(newEndTime);
        setStartTime(newStartTime);
        refetch();
      } else {
        refetch();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isAutoScroll, interval, refetch, timeOffset, timeDifference, getAdjustedTime]);

  useEffect(() => {
    const inactivityTimeout = 60 * 1000;
    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastInteractionTime > inactivityTimeout && !isAutoScroll) {
        handleReturnToCurrent(setStartTime, setEndTime, setIsAutoScroll, interval);
      }
    };

    const intervalId = setInterval(checkInactivity, 1000);

    return () => clearInterval(intervalId);
  }, [lastInteractionTime, isAutoScroll, interval, setStartTime, setEndTime, setIsAutoScroll]);

  return (
    <div className={styles['chart-container']}>
      {showIntervalSelector && <IntervalSelector />}

      {error ? (
        <div className={styles['error-message']} style={{ width, height }}>
          Ошибка при загрузке данных. Связь с сервером/оборудованием отсутствует.
        </div>
      ) : (
        <div id={id} style={{ width, height }}>
          <Line
            ref={chartRef}
            data={chartData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins?.legend,
                  onClick: (e, legendItem) => {
                    if (legendItem.datasetIndex !== undefined) {
                      handleToggleDataset(legendItem.datasetIndex);
                    }
                  },
                },
              },
            }}
          />
        </div>
      )}

      <div className={styles['dynamic-graph__btns']}>
        <button
          className={styles['dynamic-graph__btn']}
          onClick={handleBackwardWithInteraction}
        >
          Назад
        </button>
        <button
          className={styles['dynamic-graph__btn']}
          onClick={handleForwardWithInteraction}
        >
          Вперёд
        </button>
        <button className={styles['dynamic-graph__btn']} onClick={handleToggleAll}>
          {allHidden ? 'Показать все' : 'Скрыть все'}
        </button>
        <button
          className={styles['dynamic-graph__btn']}
          onClick={handleReturnToCurrentWithInteraction}
        >
          Вернуться к текущим данным
        </button>
      </div>
    </div>
  );
};

export default UniversalChart;