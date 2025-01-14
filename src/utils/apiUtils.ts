export const getApiBaseUrl = () => {
  // Значения по умолчанию для development
  const defaultHost = 'localhost';
  const defaultPort = '3002'; // Порт по умолчанию

  // Получаем значения из переменных окружения или используем значения по умолчанию
  const host = process.env.REACT_APP_API_HOST || defaultHost;
  const port = process.env.REACT_APP_API_PORT || defaultPort;

  // Собираем базовый URL API
  const apiBaseUrl = `${host}:${port}`;

  return apiBaseUrl;
};