import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import IntroPage from './pages/IntroPage';
import UveCheckFormPage from './pages/UveCheckFormPage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/layout/Header';

function App() {
  return (
    <AppProvider>
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
            <Header />
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/assessment" element={<UveCheckFormPage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </div>
      </main>
    </AppProvider>
  );
}

export default App;
