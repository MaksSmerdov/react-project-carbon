import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from '../homePage.module.scss';
import CurrentEnergyResources from '../../../components/Current/energyResources/currentEnergyResources';
import UniversalChart from '../../../components/Charts/chart';
import { IntervalProvider } from '../../../components/Charts/context/intervalContext';
import { getApiBaseUrl } from '../../../utils/apiUtils';
import ReportDaily from '../../../components/Reports/Daily/dailyReport';
import ReportMonthly from '../../../components/Reports/Montly/monthlyReport';

interface EnergyResourcesTabsProps {
  selectedSubTabIndex: number;
  handleSubTabChange: (index: number) => void;
}

const EnergyResourcesTabs: React.FC<EnergyResourcesTabsProps> = ({ selectedSubTabIndex, handleSubTabChange }) => {
  const apiBaseUrl = getApiBaseUrl();

  return (
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
          <CurrentEnergyResources />
        </div>
      </TabPanel>

      <TabPanel>
        <div key={`energyresources-chartRashod-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
          <IntervalProvider>
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
              animationEnabled={false}
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
                `${apiBaseUrl}/api/DD924/data`,
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
              animationEnabled={false}
            />
          </IntervalProvider>
        </div>
      </TabPanel>

      <TabPanel>
        <div key={`energyresources-daily-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
          <ReportDaily />
        </div>
      </TabPanel>

      <TabPanel>
        <div key={`energyresources-monthly-${selectedSubTabIndex}`} className={styles['sub-tab-content']}>
          <ReportMonthly />
        </div>
      </TabPanel>
    </Tabs>
  );
};

export default EnergyResourcesTabs;