import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Импортируем стандартные стили
import styles from './homePage.module.scss';
import MnemoSushilka from '../components/Mnemo/sushilka/mnemoSushilka';
import CurrentParameter from '../components/Current/currentParameter';
import { apiConfigs } from '../configs/apiConfigSushilka';
import UniversalChart from '../components/Charts/chart';
import { IntervalProvider } from '../components/Charts/context/intervalContext';
import { getApiBaseUrl } from '../utils/apiUtils'; // Импортируем функцию
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
      <Loader delay={1000} size={100} />

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
                          label: 'Температура в топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'Температура в камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Температура уходящих газов',
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
                          label: 'Температура в топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'Температура в камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Температура уходящих газов',
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
                          label: 'Разрежение воздуха на разбавление',
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
                          label: 'Разрежение воздуха на разбавление',
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
                          label: 'Температура в топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'Температура в камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Температура уходящих газов',
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
                          label: 'Температура в топке',
                          unit: '°C',
                        },
                        {
                          key: 'Температура в камере смешения',
                          label: 'Температура в камере смешения',
                          unit: '°C',
                        },
                        {
                          key: 'Температура уходящих газов',
                          label: 'Температура уходящих газов',
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
                          label: 'Разрежение воздуха на разбавление',
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
                          label: 'Разрежение воздуха на разбавление',
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
                  Отчет суточный
                </Tab>
                <Tab className={styles['sub-tab']} selectedClassName={styles['sub-tab--selected']}>
                  Отчет месячный
                </Tab>
              </TabList>

              {/* Панель мнемосхемы */}
              <TabPanel>
                <div key={`energyresources-dayli-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <MnemoSushilka configKey="sushilka2" title="Сушилка №2" objectNumber={2} />
                </div>
              </TabPanel>

              {/* Панель текущих параметров */}
              <TabPanel>
                <div key={`energyresources-monthly-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
                  <CurrentParameter config={apiConfigs.sushilka2} title="Сушилка №2" />
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
