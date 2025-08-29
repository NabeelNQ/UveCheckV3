import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function IntroPage() {
  const navigate = useNavigate();

  return (
    <Card className="text-center">
      <div className="text-left space-y-4 text-slate-700 max-w-prose mx-auto">
        <p>
          Introducing a specialized health screening app developed to support early detection of uveitis in children with juvenile idiopathic arthritis (JIA).
        </p>
        <p>
          By applying advanced algorithms to key risk factors, the app provides personalized screening recommendations. It equips healthcare professionals with actionable insights, enabling timely clinical decisions and better patient outcomes.
        </p>
        <p>
          Stay informed, stay proactive, and strengthen uveitis care with our predictive screening app.
        </p>
      </div>

      <div className="mt-10">
        <Button onClick={() => navigate('/assessment')}>
          START TEST
        </Button>
      </div>
    </Card>
  );
}

export default IntroPage;
