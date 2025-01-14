import { ChartOptions } from 'chart.js';

export const colors = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(201, 203, 207, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 99, 71, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 255, 1)',
    'rgba(255, 20, 147, 1)',
    'rgba(139, 69, 19, 1)',
    'rgba(128, 0, 128, 1)',
    'rgba(0, 0, 255, 1)',
];

export const getChartOptions = (
    startTime: number,
    endTime: number,
    title: string,
    isAutoScroll: boolean,
    params: { key: string; label: string; unit?: string }[],
    yMin?: number,
    yMax?: number,
): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        title: {
            display: true,
            text: title,
            font: {
                size: 18,
                weight: 'bold',
            },
            color: 'green',
            padding: {
                top: 10,
                bottom: 20,
            },
        },
        legend: {
            display: true,
            position: 'right',
            labels: {
                generateLabels: (chart) => {
                    return chart.data.datasets.map((dataset, index) => {
                        const value = dataset.data.length ? dataset.data[dataset.data.length - 1] : '';
                        const label = dataset.label || '';
                        const unit = params[index]?.unit || ''; 
                        return {
                            text: `${value} ${unit} | ${label}`,
                            fillStyle: dataset.borderColor as string,
                            hidden: !chart.isDatasetVisible(index),
                            datasetIndex: index,
                        };
                    });
                },
            },
        },
        tooltip: {
            enabled: true,
            callbacks: {
                title: (tooltipItems) => {
                    if (tooltipItems.length > 0) {
                        const parsedTime = tooltipItems[0].parsed.x;
                        const date = new Date(parsedTime);
                        return date.toLocaleString('ru-RU');
                    }
                    return '';
                },
                label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw !== null ? context.raw : '—';
                    const unit = params[context.datasetIndex]?.unit || ''; 
                    return `${label}: ${value !== null ? value + ' ' + unit : 'Нет данных'}`;
                },
            },
        },
        crosshair: {
            line: {
                color: 'black',
                width: 1,
            },
            sync: {
                enabled: false,
            },
            zoom: {
                enabled: false,
            },
            snap: {
                enabled: true,
            },
        },
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'minute',
                displayFormats: {
                    minute: 'HH:mm',
                },
            },
            ticks: {
                maxTicksLimit: 20,
            },
            min: startTime,
            max: isAutoScroll ? endTime + 2 * 60 * 1000 : endTime,
        },
        y: {
            beginAtZero: false,
            min: yMin,
            max: yMax,
        },
    },
    elements: {
        point: {
            radius: 2,
        },
    },
});
