import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  format?: string; // Новый пропс для формата даты
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  handleDateChange,
  format = 'dd.MM', // Значение по умолчанию
}) => {
  // Определяем, нужно ли отображать только месяцы
  const isMonthOnly = format === 'MM.yyyy' || format === 'MM.yy';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <DatePicker
        label="Выберите дату"
        value={selectedDate}
        onChange={handleDateChange}
        format={format} // Используем переданный формат
        views={isMonthOnly ? ['month', 'year'] : ['year', 'month', 'day']} // Отображаем только месяцы и годы, если формат "месяц.год"
        openTo={isMonthOnly ? 'month' : 'day'} // Открываем календарь на месяце, если формат "месяц.год"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f0f0f0', // Фон поля ввода
            borderRadius: '8px', // Закругление углов
            height: '40px', // Высота поля ввода
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc', // Цвет бордера по умолчанию
              transition: 'border-color 0.5s ease', // Плавный переход для бордера
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'green', // Зеленый бордер при фокусе
                borderWidth: '2px', // Толщина бордера
                transition: 'border-color 0.5s ease', // Плавный переход для бордера
              },
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'green', // Цвет бордера при наведении
            },
          },
          '& .MuiInputLabel-root': {
            left: '-3px',
            fontWeight: '600',
            color: 'black', // Цвет label по умолчанию
            transition: 'color 0.5s ease', // Плавный переход для label
            '&.Mui-focused': {
              color: 'black',
            },
          },
        }}
        slotProps={{
          popper: {
            sx: {
              '& .MuiPickersDay-root': {
                '&:hover': {
                  backgroundColor: 'rgba(0, 128, 0, 0.5) !important', // Зеленый с прозрачностью 0.5 при наведении
                },
                '&.Mui-selected': {
                  backgroundColor: 'green !important', // Зеленый цвет для выбранного числа
                  color: 'white !important', // Белый текст для лучшей читаемости
                  '&:hover': {
                    backgroundColor: 'darkgreen !important', // Темно-зеленый при наведении на выбранное число
                  },
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;