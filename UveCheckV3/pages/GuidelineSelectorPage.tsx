import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { GUIDELINES } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { Guideline } from '../types';

function GuidelineSelectorPage() {
  const navigate = useNavigate();
  const { setSelectedGuideline } = useAppContext();
  const [localGuideline, setLocalGuideline] = useState<Guideline | ''>('');

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalGuideline(e.target.value as Guideline);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localGuideline) {
      setSelectedGuideline(localGuideline);
      navigate('/form');
    }
  };

  const guidelineOptions = GUIDELINES.map(g => ({ value: g.id, label: g.name }));

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select a Guideline</h2>
        <p className="text-gray-600 mb-8">Choose the regional guideline to begin the risk assessment.</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <Select
          label="Country/Region Guideline"
          name="guideline"
          value={localGuideline}
          onChange={handleSelect}
          options={guidelineOptions}
          required
        />
        <div className="text-center pt-2">
          <Button type="submit" disabled={!localGuideline}>
            Continue
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default GuidelineSelectorPage;
