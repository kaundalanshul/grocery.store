import React from 'react';
import { HomePage } from '../components/Home';

const Home = ({ theme, onToggleTheme }) => {
  return <HomePage theme={theme} onToggleTheme={onToggleTheme} />;
};

export default Home;