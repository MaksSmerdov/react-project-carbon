import React, { useState } from "react";
import styles from "./passwordForm.module.scss"; // Импорт стилей

interface PasswordFormProps {
  onConfirm: (password: string) => void; // Функция подтверждения пароля
  correctPassword: string; // Правильный пароль
  errorMessage?: string; // Сообщение об ошибке (опционально)
  onError?: (message: string) => void; // Функция для установки ошибки
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  onConfirm,
  correctPassword,
  errorMessage = "",
  onError,
}) => {
  const [password, setPassword] = useState<string>(""); // Состояние для ввода пароля

  // Обработчик изменения пароля
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (onError) onError(""); // Сброс ошибки при изменении пароля
  };

  // Обработчик подтверждения пароля
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password === correctPassword) {
      onConfirm(password); // Вызов функции подтверждения
    } else {
      if (onError) onError("Неверный пароль"); // Установка ошибки
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="password">Введите пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className={styles.inputField}
          required
        />
      </div>

      {/* Отображение ошибки */}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      {/* Кнопка подтверждения */}
      <button type="submit" className={styles.submitButton}>
        Подтвердить
      </button>
    </form>
  );
};

export default PasswordForm;