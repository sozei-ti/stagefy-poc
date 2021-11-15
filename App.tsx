import React from 'react';
import { StreamProvider } from './src/context/stream';
import { Home } from './src/pages/Home';

const App = () => {
  return (
    <StreamProvider>
      <Home />
    </StreamProvider>
  );
};

export default App;
