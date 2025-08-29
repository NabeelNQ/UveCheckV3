import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { RiskLevel } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const getScreeningMessage = (riskLevel: RiskLevel): { message: string, color: string } => {
  switch (riskLevel) {
    case RiskLevel.High:
      return { message: 'Screening every 3 months', color: 'text-red-600' };
    case RiskLevel.Medium:
      return { message: 'Screening every 6 months', color: 'text-amber-600' };
    case RiskLevel.Low:
      return { message: 'Screening every 12 months', color: 'text-green-600' };
    case RiskLevel.NoRisk:
      return { message: 'No elevated risk detected. Follow standard clinical advice.', color: 'text-slate-700' };
    default:
      return { message: 'Consult with a specialist for screening recommendations.', color: 'text-gray-800' };
  }
};

const RiskIndicator: React.FC<{ riskLevel: RiskLevel }> = ({ riskLevel }) => {
  const levelInfo = {
    [RiskLevel.High]: { text: 'High Risk', color: 'bg-red-500' },
    [RiskLevel.Medium]: { text: 'Medium Risk', color: 'bg-yellow-500' },
    [RiskLevel.Low]: { text: 'Low Risk', color: 'bg-green-500' },
    [RiskLevel.NoRisk]: { text: 'No Risk', color: 'bg-gray-500' },
  };
  const info = levelInfo[riskLevel] || { text: 'Undefined', color: 'bg-gray-400' };

  return (
    <div className="text-center p-8 rounded-lg bg-slate-50 border border-slate-200">
      <p className="text-lg text-slate-600 mb-2">Calculated Risk Level</p>
      <h2 className="text-5xl font-bold flex items-center justify-center gap-4 text-slate-900">
        <span className={`h-4 w-4 rounded-full ${info.color}`}></span>
        {info.text}
        <span className={`h-4 w-4 rounded-full ${info.color}`}></span>
      </h2>
    </div>
  );
};

function ResultsPage() {
  const { result, setSelectedGuideline, setResult } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  if (!result) return null;

  const handleStartOver = () => {
    setSelectedGuideline(null);
    setResult(null);
    navigate('/');
  };

  const screening = getScreeningMessage(result.riskLevel);

  return (
    <Card>
      <div className="space-y-8">
        <RiskIndicator riskLevel={result.riskLevel} />

        <div className="text-center p-6 bg-slate-100 rounded-lg">
          <p className="text-lg text-slate-700">Recommended Action:</p>
          <p className={`text-2xl font-bold ${screening.color}`}>{screening.message}</p>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Guideline-Specific Details</h3>
          <div className="p-4 bg-slate-50 rounded-md text-slate-700">
            <p><span className="font-bold">Recommendation:</span> {result.rawRecommendation}</p>
            <p><span className="font-bold">Follow-up Advice:</span> {result.followUp}</p>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Calculation Inputs</h3>
           <div className="p-4 bg-slate-50 rounded-md grid grid-cols-2 gap-2 text-slate-700">
              {Object.entries(result.details).map(([key, value]) => (
                <p key={key}><span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}</p>
              ))}
           </div>
        </div>

        <div className="text-center pt-6">
          <Button onClick={handleStartOver} variant="secondary">Start New Assessment</Button>
        </div>
      </div>
    </Card>
  );
}

export default ResultsPage;
