import React from "react";
import ReactModal from "react-modal";
import styles from "./modal.module.scss";

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, title, children, onClose }) => {
  // Обязательно укажите элемент для привязки модалки
  ReactModal.setAppElement("#root");

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: styles.modalPaper,
        afterOpen: styles.modalPaperAfterOpen, // Стили при открытии
        beforeClose: styles.modalPaperBeforeClose, // Стили при закрытии
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: styles.modalOverlayAfterOpen, // Класс после открытия оверлея
        beforeClose: styles.modalOverlayBeforeClose, // Класс перед закрытием оверлея
      }}
      closeTimeoutMS={500} // Анимация закрытия (в миллисекундах)
      shouldCloseOnOverlayClick={false} // Закрытие при клике на фон
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <button
          className={styles.closeButton}
          aria-label="Close"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
      <div className={styles.modalContent}>{children}</div>
    </ReactModal>
  );
};

export default CustomModal;
