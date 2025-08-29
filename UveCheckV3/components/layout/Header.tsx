import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-900">UveCheck</h1>
      <p className="text-lg text-slate-600 mt-1">Predict the risk of uveitis in children</p>
    </header>
  );
};

export default Header;
