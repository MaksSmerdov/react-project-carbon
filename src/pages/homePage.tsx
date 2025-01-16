import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Импортируем стандартные стили
import styles from './homePage.module.scss';
import MnemoSushilka from '../components/Mnemo/sushilka/mnemoSushilka';
import CurrentParameter from '../components/Current/sushilka/currentParameter';
import { apiConfigs } from '../configs/apiConfigSushilka';
import UniversalChart from '../components/Charts/chart';
import { IntervalProvider } from '../components/Charts/context/intervalContext';
import { getApiBaseUrl } from '../utils/apiUtils'; // Импортируем функцию
import CurrentEnergyResources from '../components/Current/energyResources/currentEnergyResources';
import ReportPage from '../components/Reports/Montly/monthlyReport';
import ReportDaily from '../components/Reports/Daily/dailyReport';
import Loader from '../components/Common/Preloader/preloader';

const HomePage: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [selectedSubTabIndex, setSelectedSubTabIndex] = useState<number>(0);

  const apiBaseUrl = getApiBaseUrl(); // Получаем базовый URL

  const handleTabChange = (index: number) => {
    setSelectedTabIndex(index);
    setSelectedSubTabIndex(0); // Сбрасываем саб-таб на "Мнемосхему"
  };

  const handleSubTabChange = (index: number) => {
    setSelectedSubTabIndex(index);
  };

  return (
    <div className={styles['container']}>
      <Loader delay={3000} size={100} />

      <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabChange}>
        <TabList className={styles['tab-list']}>
          <Tab className={styles['tab']} selectedClassName={styles['tab--selected']}>
            Сушилка №1
          </Tab>
          <Tab className={styles['tab']} selectedClassName={styles['tab--selected']}>
            Сушилка №2
          </Tab>
          <Tab className={styles['tab']} selectedClassName={styles['tab--selected']}>
            Энергоресурсы
          </Tab>
        </TabList>

        {/* Панель для сушилки №1 */}
        <TabPanel>
          <div className={styles['tab-content']}>
            <Tabs selectedIndex={selectedSubTabIndex} onSelect={handleSubTabChange}>
              <TabList className={styles['sub-tab-list']}>
                <Tab
                  className={styles['sub-tab']}
                  selectedClassName={styles['sub-tab--selected']} // Класс для активного саб-таба
                >
                  Мнемосхема
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Текущие параметры
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Графики температур
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Графики давлений
                </Tab>
              </TabList>

              {/* Панель мнемосхемы */}
              <TabPanel>
                <div key={`sushilka1-mnemo-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <MnemoSushilka configKey="sushilka1" title="Сушилка №1" objectNumber={1} />
                </div>
              </TabPanel>

              {/* Панель текущих параметров */}
              <TabPanel>
                <div key={`sushilka1-params-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <CurrentParameter config={apiConfigs.sushilka1} title="Сушилка №1" />
                </div>
              </TabPanel>

              {/* Панель графиков температур */}
              <TabPanel>
                <div key={`sushilka1-charts-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <IntervalProvider>
                    <UniversalChart
                      id="chart-sushilka1"
                      apiUrl={`${apiBaseUrl}/api/sushilka1/data`} // Используем базовый URL
                      title="График температур сушилки №1"
                      yMin={-315}
                      yMax={315}
                      dataKey="temperatures"
                      params={[
                        {
                          key: 'Температура в топке',
                          label: 'В топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'В камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Уходящих газов',
                          unit: '°C',
                        },
                      ]}
                      showIntervalSelector={true}
                    />
                    <UniversalChart
                      id="chart-sushilka2"
                      apiUrl={`${apiBaseUrl}/api/sushilka2/data`} // Используем базовый URL
                      title="График температур сушилки №2"
                      yMin={-315}
                      yMax={315}
                      dataKey="temperatures"
                      params={[
                        {
                          key: 'Температура в топке',
                          label: 'В топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'В камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Уходящих газов',
                          unit: '°C',
                        },
                      ]}
                      showIntervalSelector={false}
                    />
                  </IntervalProvider>
                </div>
              </TabPanel>

              {/* Панель графиков давлений */}
              <TabPanel>
                <div key={`sushilka1-charts-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <IntervalProvider>
                    <UniversalChart
                      id="chart-sushilka1"
                      apiUrl={`${apiBaseUrl}/api/sushilka1/data`} // Используем базовый URL
                      title="График давления/разрежения сушилки №1"
                      yMin={-20}
                      yMax={30}
                      dataKey="vacuums"
                      params={[
                        {
                          key: 'Разрежение в топке',
                          label: 'В топке',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение в камере выгрузки',
                          label: 'В камере выгрузки',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение воздуха на разбавление',
                          label: 'Воздух на разбавление',
                          unit: 'кгс/м²',
                        },
                      ]}
                      showIntervalSelector={true}
                    />
                    <UniversalChart
                      id="chart-sushilka2"
                      apiUrl={`${apiBaseUrl}/api/sushilka2/data`} // Используем базовый URL
                      title="График давления/разрежения сушилки №2"
                      yMin={-20}
                      yMax={30}
                      dataKey="vacuums"
                      params={[
                        {
                          key: 'Разрежение в топке',
                          label: 'В топке',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение в камере выгрузки',
                          label: 'В камере выгрузки',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение воздуха на разбавление',
                          label: 'Воздух на разбавление',
                          unit: 'кгс/м²',
                        },
                      ]}
                      showIntervalSelector={false}
                    />
                  </IntervalProvider>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </TabPanel>

        {/* Панель для сушилки №2 */}
        <TabPanel>
          <div className={styles['tab-content']}>
            <Tabs selectedIndex={selectedSubTabIndex} onSelect={handleSubTabChange}>
              <TabList className={styles['sub-tab-list']}>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Мнемосхема
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Текущие параметры
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  График температур
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  График давлений
                </Tab>
              </TabList>

              {/* Панель мнемосхемы */}
              <TabPanel>
                <div key={`sushilka2-mnemo-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <MnemoSushilka configKey="sushilka2" title="Сушилка №2" objectNumber={2} />
                </div>
              </TabPanel>

              {/* Панель текущих параметров */}
              <TabPanel>
                <div key={`sushilka2-params-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <CurrentParameter config={apiConfigs.sushilka2} title="Сушилка №2" />
                </div>
              </TabPanel>

              {/* Панель графиков температур */}
              <TabPanel>
                <div key={`sushilka1-charts-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <IntervalProvider>
                    <UniversalChart
                      id="chart-sushilka1"
                      apiUrl={`${apiBaseUrl}/api/sushilka1/data`} // Используем базовый URL
                      title="График температур сушилки №1"
                      yMin={-315}
                      yMax={315}
                      dataKey="temperatures"
                      params={[
                        {
                          key: 'Температура в топке',
                          label: 'В топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'В камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Уходящих газов',
                          unit: '°C',
                        },
                      ]}
                      showIntervalSelector={true}
                    />
                    <UniversalChart
                      id="chart-sushilka2"
                      apiUrl={`${apiBaseUrl}/api/sushilka2/data`} // Используем базовый URL
                      title="График температур сушилки №2"
                      yMin={-315}
                      yMax={315}
                      dataKey="temperatures"
                      params={[
                        {
                          key: 'Температура в топке',
                          label: 'В топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'В камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Уходящих газов',
                          unit: '°C',
                        },
                      ]}
                      showIntervalSelector={false}
                    />
                  </IntervalProvider>
                </div>
              </TabPanel>

              {/* Панель графиков давлений */}
              <TabPanel>
                <div key={`sushilka1-charts-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <IntervalProvider>
                    <UniversalChart
                      id="chart-sushilka1"
                      apiUrl={`${apiBaseUrl}/api/sushilka1/data`} // Используем базовый URL
                      title="График давления/разрежения сушилки №1"
                      yMin={-20}
                      yMax={30}
                      dataKey="vacuums"
                      params={[
                        {
                          key: 'Разрежение в топке',
                          label: 'В топке',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение в камере выгрузки',
                          label: 'В камере выгрузки',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение воздуха на разбавление',
                          label: 'Воздух на разбавление',
                          unit: 'кгс/м²',
                        },
                      ]}
                      showIntervalSelector={true}
                    />
                    <UniversalChart
                      id="chart-sushilka2"
                      apiUrl={`${apiBaseUrl}/api/sushilka2/data`} // Используем базовый URL
                      title="График давления/разрежения сушилки №2"
                      yMin={-20}
                      yMax={30}
                      dataKey="vacuums"
                      params={[
                        {
                          key: 'Разрежение в топке',
                          label: 'В топке',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение в камере выгрузки',
                          label: 'В камере выгрузки',
                          unit: 'кгс/см²',
                        },
                        {
                          key: 'Разрежение воздуха на разбавление',
                          label: 'Воздух на разбавление',
                          unit: 'кгс/м²',
                        },
                      ]}
                      showIntervalSelector={false}
                    />
                  </IntervalProvider>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </TabPanel>

        <TabPanel>
          <div className={styles['tab-content']}>
            <Tabs selectedIndex={selectedSubTabIndex} onSelect={handleSubTabChange}>
              <TabList className={styles['sub-tab-list']}>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Текущие параметры
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Графики энергоресурсов
                </Tab>

                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Отчет суточный
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Отчет месячный
                </Tab>
              </TabList>

              <TabPanel>
                <div key={`energyresources-current-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <CurrentEnergyResources></CurrentEnergyResources>
                </div>
              </TabPanel>

              <TabPanel>
                <div key={`energyresources-chartRashod-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  {/* <IntervalProvider>
                    <UniversalChart
                      id="chart-rashodPar"
                      apiUrls={[
                        `${apiBaseUrl}/api/DE093/data`,
                        `${apiBaseUrl}/api/DD972/data`,
                        `${apiBaseUrl}/api/DD973/data`,
                      ]}
                      title="График расхода пара на МПА"
                      yMin={0}
                      yMax={5}
                      dataKey="data"
                      params={[
                        { key: 'Тонн/ч DE093', label: 'МПА2', unit: 'тонн/ч' },
                        { key: 'Тонн/ч DD972', label: 'МПА3', unit: 'тонн/ч' },
                        { key: 'Тонн/ч DD973', label: 'МПА4', unit: 'тонн/ч' },
                      ]}
                      showIntervalSelector={true}
                    />
                    <UniversalChart
                      id="chart-davleniePar"
                      apiUrls={[
                        `${apiBaseUrl}/api/DE093/data`,
                        `${apiBaseUrl}/api/DD972/data`,
                        `${apiBaseUrl}/api/DD973/data`,
                        `${apiBaseUrl}/api/DD576/data`,
                        `${apiBaseUrl}/api/DD569/data`,
                        `${apiBaseUrl}/api/DD923/data`,
                        `${apiBaseUrl}/api/DD924/data`
                      ]}
                      title="График давления пара производства CARBON"
                      yMin={0}
                      yMax={100}
                      dataKey="data"
                      params={[
                        { key: 'Давление DE093', label: 'МПА2', unit: 'MPa' },
                        { key: 'Давление DD972', label: 'МПА3', unit: 'MPa' },
                        { key: 'Давление DD973', label: 'МПА4', unit: 'MPa' },
                        { key: 'Давление DD576', label: 'к.10в1', unit: 'MPa' },
                        { key: 'Давление DD569', label: 'От к.265 - к.10в1', unit: 'MPa' },
                        { key: 'Давление DD923', label: 'Котел утилизатор №1', unit: 'MPa' },
                        { key: 'Давление DD924', label: 'Котел утилизатор №2', unit: 'MPa' },

                      ]}
                      showIntervalSelector={false}
                    />
                  </IntervalProvider> */}
                </div>
              </TabPanel>

              <TabPanel>
                <div key={`energyresources-daily-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <ReportDaily></ReportDaily>
                </div>
              </TabPanel>

              <TabPanel>
                <div key={`energyresources-monthly-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <ReportPage></ReportPage>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default HomePage;
