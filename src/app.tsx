import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CurrentParameterSushilka1 from './pages/sushilki/currentParam/currentParam-sushilka1';
import CurrentParameterSushilka2 from './pages/sushilki/currentParam/currentParam-sushilka2';
import MnemoSushilka1 from './pages/sushilki/mnemo/mnemo-sushilka1';
import MnemoSushilka2 from './pages/sushilki/mnemo/mnemo-sushilka2';
import HomePage from './pages/homePage'; // Импортируем стартовую страницу

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        {/* Стартовая страница */}
        <Route path="/" element={<HomePage />} />

        {/* Остальные маршруты */}
        <Route path="/currentParam-sushilka1" element={<CurrentParameterSushilka1 />} />
        <Route path="/currentParam-sushilka2" element={<CurrentParameterSushilka2 />} />
        <Route path="/mnemo-sushilka1" element={<MnemoSushilka1 />} />
        <Route path="/mnemo-sushilka2" element={<MnemoSushilka2 />} />
      </Routes>
    </div>
  );
};

export default App;
