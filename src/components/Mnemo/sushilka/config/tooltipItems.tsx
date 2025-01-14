import React from "react";

export interface TooltipContent {
  id: string;
  content: React.ReactNode;
}

export const TooltipItems: TooltipContent[] = [
  {
    id: "temperaturaTopki",
    content: (
      <div>
        Прибор: Термопара (1000мм)<br />
        Диапазон: -40...+1000&#176;C<br />
        Градуировка: ХА (К)
      </div>
    ),
  },
  {
    id: "temperaturaKameraSmeshenia",
    content: (
      <div>
        Прибор: Термопара (1000мм)<br />
        Диапазон: -40...+1000&#176;C<br />
        Градуировка: ХА (К)
      </div>
    ),
  },
  {
    id: "temperaturaUhodGazov",
    content: (
      <div>
        Прибор: Термопара (1000мм)<br />
        Диапазон: -40...+1000&#176;C<br />
        Градуировка: ХА (К)
      </div>
    ),
  },
  {
    id: "davlenieTopki",
    content: (
      <div>
        Прибор: ПД-1.ТН1<br />
        Диапазон: -0,125...+0,125 кПа<br />
        Токовый выход: 4-20 мА
      </div>
    ),
  },
  {
    id: "davlenieKameraVigruzki",
    content: (
      <div>
        Прибор: ПД-1.ТН1<br />
        Диапазон: -0,125...+0,125 кПа<br />
        Токовый выход: 4-20 мА
      </div>
    ),
  },
  {
    id: "davlenieVozduhRazbavl",
    content: (
      <div>
        Прибор: ПД-1.ТН1<br />
        Диапазон: -0,125...+0,125 кПа<br />
        Токовый выход: 4-20 мА
      </div>
    ),
  },
];
