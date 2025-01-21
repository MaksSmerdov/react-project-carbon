import React from 'react';
import CurrentParameter from '../../../components/Current/sushilka/currentParameter';
import { apiConfigs } from '../../../components/Current/sushilka/apiConfigSushilka';

const CurrentParameterSushilka1: React.FC = () => {
  return <CurrentParameter config={apiConfigs.sushilka2} title="Вращающаяся сушилка №2" showLoading={true} />;
};

export default CurrentParameterSushilka1;
