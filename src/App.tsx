import React from 'react';
import { StreamProvider } from './context/stream';
import AppNavigationContainer from './app.routes';

const App = () => {
  return (
    <StreamProvider>
      <AppNavigationContainer />
    </StreamProvider>
  );
};

export default App;
