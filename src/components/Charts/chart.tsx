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
import Loader from '../Common/Preloader/preloader';

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

interface DatasetConfig {
  apiUrl: string;
  dataKey: string;
  params: { key: string; label: string; unit?: string }[];
}

interface UniversalChartProps {
  datasets: DatasetConfig[];
  title: string;
  yMin?: number;
  yMax?: number;
  width?: number | string;
  height?: number | string;
  id: string;
  showIntervalSelector?: boolean;
  animationEnabled?: boolean;
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
  datasets,
  title,
  yMin,
  yMax,
  width = '100%',
  height = '400px',
  id,
  showIntervalSelector = true,
  animationEnabled = true,
}) => {
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const chartRef = useRef<ChartJS<'line'> | null>(null);
  const { interval } = useInterval();
  const [startTime, setStartTime] = useState(new Date(Date.now() - interval * 60 * 1000));
  const [endTime, setEndTime] = useState(new Date());
  const { data, error, refetch, isLoading: isDataLoading } = useData(datasets, startTime, endTime);
  const [allHidden, setAllHidden] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [timeOffset, setTimeOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const processedData = useMemo(() => {
    return datasets.map((dataset, index) => ({
      data:
        data[index]?.map((item: GenericData) => ({
          time: new Date(item.lastUpdated),
          values: item[dataset.dataKey] || {},
        })) || [],
      params: dataset.params,
    }));
  }, [data, datasets]);

  const chartData = useMemo(() => {
    // Генерируем метки вручную, если данных нет
    const labels =
      processedData[0]?.data.length > 0
        ? processedData[0].data.map((d) => d.time)
        : Array.from(
            { length: 10 },
            (_, i) => new Date(startTime.getTime() + (i * (endTime.getTime() - startTime.getTime())) / 10)
          );

    const datasets = processedData.flatMap((dataset, datasetIndex) =>
      dataset.params.map((param, paramIndex) => ({
        label: param.label,
        data: dataset.data.length > 0 ? createDataWithGaps(dataset.data, param.key) : labels.map(() => null), // Пустые данные
        borderColor: colors[(datasetIndex * dataset.params.length + paramIndex) % colors.length],
        backgroundColor: colors[(datasetIndex * dataset.params.length + paramIndex) % colors.length],
        spanGaps: false,
      }))
    );

    return { labels, datasets };
  }, [processedData, startTime, endTime]);

  const options = useMemo(
    () =>
      getChartOptions(
        startTime.getTime(),
        endTime.getTime(),
        title,
        isAutoScroll,
        datasets.flatMap((d) => d.params),
        yMin,
        yMax,
        animationEnabled
      ),
    [startTime, endTime, title, isAutoScroll, datasets, yMin, yMax, animationEnabled]
  );
  const handleBackwardWithInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    const newOffset = timeOffset + interval * 60 * 1000;
    setTimeOffset(newOffset);
    handleBackward(startTime, endTime, setStartTime, setEndTime, setIsAutoScroll, interval);
  }, [startTime, endTime, interval, timeOffset]);

  const handleForwardWithInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    const newOffset = Math.max(0, timeOffset - interval * 60 * 1000);
    setTimeOffset(newOffset);
    handleForward(startTime, endTime, setStartTime, setEndTime, setIsAutoScroll, interval);
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
      chartRef.current.update('none');
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
      chartRef.current.update('none');
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
    }, 10000);

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

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    } else if (!isDataLoading && data.length > 0) {
      setIsLoading(false);
    }
  }, [isDataLoading, data, error]);

  return (
    <div className={styles['chart-container']}>
      {showIntervalSelector && <IntervalSelector />}

      {isLoading ? (
        <div className={styles['loader-container']} style={{ width, height }}>
          <Loader size={80} fullPage={false} />
        </div>
      ) : error ? (
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
        <button className={styles['dynamic-graph__btn']} onClick={handleBackwardWithInteraction}>
          Назад
        </button>
        <button className={styles['dynamic-graph__btn']} onClick={handleForwardWithInteraction}>
          Вперёд
        </button>
        <button className={styles['dynamic-graph__btn']} onClick={handleToggleAll}>
          {allHidden ? 'Показать все' : 'Скрыть все'}
        </button>
        <button className={styles['dynamic-graph__btn']} onClick={handleReturnToCurrentWithInteraction}>
          Вернуться к текущим данным
        </button>
      </div>
    </div>
  );
};

export default UniversalChart;
