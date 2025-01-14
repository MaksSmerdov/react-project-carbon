import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import styles from "./tooltip.module.scss";

interface TooltipProps {
  tooltipId: string;
  content: React.ReactNode;
  children: React.ReactElement;
  disabled: boolean;
  width?: string; // Базовая ширина
  responsiveWidth?: { [key: string]: string }; // Адаптивные ширины
  placement?: "top" | "bottom" | "left" | "right"; // Положение тултипа
}

const Tooltip: React.FC<TooltipProps> = ({
  tooltipId,
  content,
  children,
  disabled,
  width = "auto", // Значение по умолчанию
  responsiveWidth = {}, // Адаптивные значения ширины
  placement = "top",
}) => {
  const [currentWidth, setCurrentWidth] = useState(width);

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;

      // Устанавливаем ширину на основе адаптивных правил
      if (responsiveWidth["max-1280"] && screenWidth <= 1280) {
        setCurrentWidth(responsiveWidth["max-1280"]);
      } else {
        setCurrentWidth(width); // Базовая ширина
      }
    };

    updateWidth(); // Установить ширину при монтировании
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [width, responsiveWidth]);

  return (
    <Tippy
      className={styles["tippy-box"]}
      content={content}
      placement={placement}
      theme="custom"
      animation="shift-away"
      disabled={disabled}
      popperOptions={{
        modifiers: [
          {
            name: "customStyles",
            enabled: true,
            phase: "beforeWrite",
            fn({ state }) {
              if (state.styles.popper) {
                state.styles.popper.width = currentWidth; // Применяем текущую ширину
              }
            },
          },
        ],
      }}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
