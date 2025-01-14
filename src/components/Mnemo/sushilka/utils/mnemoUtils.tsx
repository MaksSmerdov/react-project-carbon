import React from "react";
import { TooltipItems } from "../config/tooltipItems";
import styles from "../mnemoSushilka.module.scss";

// Функция для получения контента тултипа
export const getTooltipContent = (tooltipId: string): React.ReactNode => {
  const tooltip = TooltipItems.find(item => item.id === tooltipId);
  return tooltip ? tooltip.content : null;
};

export const renderGIF = (
  src: string, 
  className: string, 
  animationsRunning: boolean, 
  animated = true
) => (
  <div className={`${styles["mnemo__gif"]} ${className}`}>
    <img
      src={src}
      alt={className}
      style={{ animationPlayState: animated && animationsRunning ? "running" : "paused" }}
    />
  </div>
);

export const staticLabels = [
  { text: <>Камера<br/>смешения</>, className: styles.kameraText },
  { text: <>Газ<br/>природный</>, className: styles.gazText },
  { text: <>Мощность<br/>горелки</>, className: styles.moshGorelkiText },
  { text: <>Задание<br/>температуры</>, className: styles.zadanieTemperText },
  { text: <>Воздух на<br/>разбавление</>, className: styles.vozduhText },
  { text: "Линия паротушения", className: styles.liniyaParotushText },
  { text: "Барабан", className: styles.barabanText },
  { text: <>Выгрузочная<br/>камера</>, className: styles.kameraVigruzkiText },
  { text: "Дымосос", className: styles.dymososText },
  { text: <>Температура уходящих <br/> газов</>, className: styles.uhodText },
  { text: "Топка", className: styles.topkaText },
  { text: "Плужковый сбрасыватель", className: styles.pluzdhSbrasyvatelText },
];

export const tooltippedParams = [
  {
    id: "temperaturaTopki",
    className: styles.topka_temper,
    dataKey: "Температура в топке",
    source: "temperatures",
    unit: "°C",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
  {
    id: "temperaturaKameraSmeshenia",
    className: styles.kamera_smeshenia,
    dataKey: "Температура в камере смешения",
    source: "temperatures",
    unit: "°C",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
  {
    id: "temperaturaUhodGazov",
    className: styles.uhod_gazov,
    dataKey: "Температура уходящих газов",
    source: "temperatures",
    unit: "°C",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
  {
    id: "davlenieTopki",
    className: styles.topka_davl,
    dataKey: "Разрежение в топке",
    source: "vacuums",
    unit: "кг/см²",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
  {
    id: "davlenieKameraVigruzki",
    className: styles.kamera_vigruzki,
    dataKey: "Разрежение в камере выгрузки",
    source: "vacuums",
    unit: "кг/см²",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
  {
    id: "davlenieVozduhRazbavl",
    className: styles.vozduh_razbavl,
    dataKey: "Разрежение воздуха на разбавление",
    source: "vacuums",
    unit: "кг/см²",
    width: "225px", // Базовая ширина
    responsiveWidth: { "max-1280": "160px" }, // Адаптивная ширина
  },
];


export const gorelkaGifs = [
  { src: "/assets/img/fire-gif.gif", className: styles["mnemo__gif-1"] },
  { src: "/assets/img/pipeline_top_coal.gif", className: styles["mnemo__gif-5"] },
  { src: "/assets/img/pipeline_middle_coal.gif", className: styles["mnemo__gif-6"] },
  { src: "/assets/img/pipeline_flow_coal.gif", className: styles["mnemo__gif-7"] },
  { src: "/assets/img/pipeline_middle_coal.gif", className: styles["mnemo__gif-8"] },
];
