
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Guideline, CalculationResult } from '../types';

interface AppContextType {
  selectedGuideline: Guideline | null;
  setSelectedGuideline: (guideline: Guideline | null) => void;
  result: CalculationResult | null;
  setResult: (result: CalculationResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  return (
    <AppContext.Provider value={{ selectedGuideline, setSelectedGuideline, result, setResult }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
