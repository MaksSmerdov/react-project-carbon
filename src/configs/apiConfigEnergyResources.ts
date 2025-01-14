import { getApiBaseUrl } from "../utils/apiUtils";

export interface ApiConfig {
  apiUrl: string;
  defaultData: Record<string, Record<string, string | number>>;
  titles?: Record<string, string>;
  displayNames?: Record<string, Record<string, string>>;
}

const apiBaseUrl = getApiBaseUrl(); // Получаем базовый URL

export const apiConfigs: Record<string, ApiConfig> = {
  dd924: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD924": "—",
        "Температура DD924": "—",
        "Давление DD924": "—",
        "Куб/ч DD924": "—",
        "Тонн/ч DD924": "—",
        "Накопленно тонн DD924": "—"
      },
    },
  },
  de093: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DE093": "—",
        "Температура DE093": "—",
        "Давление DE093": "—",
        "Куб/ч DE093": "—",
        "Тонн/ч DE093": "—",
        "Накопленно тонн DE093": "—"
      },
    },
  },
  dd973: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD973": "—",
        "Температура DD973": "—",
        "Давление DD973": "—",
        "Куб/ч DD973": "—",
        "Тонн/ч DD973": "—",
        "Накопленно тонн DD973": "—"
      },
    },
  },
  dd972: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD972": "—",
        "Температура DD972": "—",
        "Давление DD972": "—",
        "Куб/ч DD972": "—",
        "Тонн/ч DD972": "—",
        "Накопленно тонн DD972": "—"
      },
    },
  },

  dd576: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD576": "—",
        "Температура DD576": "—",
        "Давление DD576": "—",
        "Куб/ч DD576": "—",
        "Тонн/ч DD576": "—",
        "Накопленно тонн DD576": "—"
      },
    },
  },
  dd569: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD569": "—",
        "Температура DD569": "—",
        "Давление DD569": "—",
        "Куб/ч DD569": "—",
        "Тонн/ч DD569": "—",
        "Накопленно тонн DD569": "—"
      },
    },
  },
  dd923: {
    apiUrl: `${apiBaseUrl}/api/uzliUchetaCarbon`,
    defaultData: {
      data: {
        "Гкал/ч DD923": "—",
        "Температура DD923": "—",
        "Давление DD923": "—",
        "Куб/ч DD923": "—",
        "Тонн/ч DD923": "—",
        "Накопленно тонн DD923": "—"
      },
    },
  },
};
  