import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styles from './homePage.module.scss';
import Loader from '../../components/Common/Preloader/preloader';
import SushilkaTabs from './components/sushilkaTabs';
import EnergyResourcesTabs from './components/energyResourcesTabs';

const HomePage: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [selectedSubTabIndex, setSelectedSubTabIndex] = useState<number>(0);

  const handleTabChange = (index: number) => {
    setSelectedTabIndex(index);
    setSelectedSubTabIndex(0); 
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

        <TabPanel>
          <div className={styles['tab-content']}>
            <SushilkaTabs
              selectedSubTabIndex={selectedSubTabIndex}
              handleSubTabChange={handleSubTabChange}
              sushilkaNumber={1}
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className={styles['tab-content']}>
            <SushilkaTabs
              selectedSubTabIndex={selectedSubTabIndex}
              handleSubTabChange={handleSubTabChange}
              sushilkaNumber={2}
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className={styles['tab-content']}>
            <EnergyResourcesTabs
              selectedSubTabIndex={selectedSubTabIndex}
              handleSubTabChange={handleSubTabChange}
            />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default HomePage;