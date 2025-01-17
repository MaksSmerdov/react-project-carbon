import { getApiBaseUrl } from "../../../../utils/apiUtils";

export interface ReportData {
  day: string;
  DE093: string | number;
  DD972: string | number;
  DD973: string | number;
  DD576: string | number;
  DD569: string | number;
  DD923: string | number;
  DD924: string | number;
}

export interface Totals {
  DE093: number;
  DD972: number;
  DD973: number;
  DD576: number;
  DD569: number;
  DD923: number;
  DD924: number;
}

const apiBaseUrl = getApiBaseUrl();

// Загрузка данных за выбранный месяц
export const loadDataForSelectedMonth = async (selectedMonth: Date | null) => {
  if (!selectedMonth) {
    alert('Пожалуйста, выберите месяц.');
    return [];
  }

  try {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
    const formattedMonth = `${year}-${month}`;

    const response = await fetch(`${apiBaseUrl}/api/reportRoutes/getReportDataMonth?month=${formattedMonth}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        day: item.day,
        DE093: item.DE093 === '-' ? '' : item.DE093,
        DD972: item.DD972 === '-' ? '' : item.DD972,
        DD973: item.DD973 === '-' ? '' : item.DD973,
        DD576: item.DD576 === '-' ? '' : item.DD576,
        DD569: item.DD569 === '-' ? '' : item.DD569,
        DD923: item.DD923 === '-' ? '' : item.DD923,
        DD924: item.DD924 === '-' ? '' : item.DD924,
      }));
    } else {
      return Array.from({ length: new Date(year, selectedMonth.getMonth() + 1, 0).getDate() }, (_, i) => ({
        day: `${i + 1}`,
        DE093: '',
        DD972: '',
        DD973: '',
        DD576: '',
        DD569: '',
        DD923: '',
        DD924: '',
      }));
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw new Error('Произошла ошибка при загрузке данных. Попробуйте позже.');
  }
};

// Расчет итоговых значений
export const calculateTotals = (data: ReportData[]) => {
  return {
    DE093: calculateTotal(data, 'DE093'),
    DD972: calculateTotal(data, 'DD972'),
    DD973: calculateTotal(data, 'DD973'),
    DD576: calculateTotal(data, 'DD576'),
    DD569: calculateTotal(data, 'DD569'),
    DD923: calculateTotal(data, 'DD923'),
    DD924: calculateTotal(data, 'DD924'),
  };
};

// Расчет суммы для конкретного поля
export const calculateTotal = (data: ReportData[], field: keyof ReportData): number => {
  return data.reduce((sum, item) => {
    const value = item[field];
    if (value === '') return sum;
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return sum + (numericValue || 0);
  }, 0);
};

// Сбор измененных данных
export const collectModifiedData = (reportData: ReportData[], originalData: ReportData[]) => {
  const modifications: Array<{ day: string; model: string; value: number }> = [];

  reportData.forEach((currentData) => {
    const originalDataItem = originalData.find((data) => data.day === currentData.day);
    if (originalDataItem) {
      ['DE093', 'DD972', 'DD973', 'DD576', 'DD569', 'DD923', 'DD924'].forEach((model) => {
        const currentValue = currentData[model as keyof ReportData];
        const originalValue = originalDataItem[model as keyof ReportData];

        if (currentValue !== originalValue) {
          const numericValue = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
          modifications.push({
            day: currentData.day,
            model,
            value: numericValue || 0,
          });
        }
      });
    }
  });

  return modifications;
};

// Отправка изменений на сервер
export const saveChanges = async (modifications: Array<{ day: string; model: string; value: number }>, password: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/reportRoutes/correctReportData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modifications, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Неверный пароль или ошибка при сохранении.');
    }

    return true;
  } catch (error) {
    console.error('Ошибка при сохранении изменений:', error);
    throw error;
  }
};