import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { calculateRisk } from '../services/uveCheckLogic';
import { FormData, Guideline } from '../types';
import { GUIDELINES, SUBDIAGNOSIS_OPTIONS, BIOLOGICAL_TREATMENT_OPTIONS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import CustomSelect from '../components/ui/CustomSelect';
import RadioGroup from '../components/ui/RadioGroup';

const initialFormData: FormData = {
  birthDate: '',
  diagnosisDate: '',
  subdiagnosis: '',
  anaPositive: 'na',
  methotrexate: 'na',
  discontinuedTreatment: 'na',
  biologicalTreatment: 'None / Other',
};

const guidelineFields: Record<Guideline, (keyof FormData)[]> = {
    [Guideline.Nordic]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive', 'methotrexate', 'discontinuedTreatment', 'biologicalTreatment'],
    [Guideline.US_Pakistan]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.Germany]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.Spain_Portugal]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.UK]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.Czech_Slovak]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.Argentina]: ['birthDate', 'diagnosisDate', 'subdiagnosis', 'anaPositive'],
    [Guideline.MIWGUC]: ['birthDate', 'diagnosisDate', 'subdiagnosis'],
};

function UveCheckFormPage() {
  const { selectedGuideline, setSelectedGuideline, setResult } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (selectedGuideline) {
        setFormData(initialFormData);
    }
  }, [selectedGuideline]);

  const handleGuidelineChange = (value: string | null) => {
    setSelectedGuideline(value as Guideline | null);
  };
  
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
      if (value) {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuideline) {
        setError("Please select an algorithm to begin.");
        return;
    }

    const requiredFields = guidelineFields[selectedGuideline];
    for (const field of requiredFields) {
        if (!formData[field] || formData[field] === 'na') {
            const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
            setError(`Please fill out all required fields. Missing: ${fieldName}`);
            return;
        }
    }
    setError('');
    
    try {
        const result = calculateRisk(selectedGuideline, formData);
        setResult(result);
        navigate('/results');
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    }
  };
  
  const isGuidelineSelected = !!selectedGuideline;
  const fields = selectedGuideline ? guidelineFields[selectedGuideline] : [];
  const subDiagnosisOptions = selectedGuideline ? (SUBDIAGNOSIS_OPTIONS[selectedGuideline] || []) : [];
  const yesNoOptions = [{label: 'Yes', value: 'y'}, {label: 'No', value: 'n'}];
  const guidelineOptions = GUIDELINES.map(g => ({ value: g.id, label: g.name }));

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomSelect
          label="Select Algorithm"
          placeholder="Select an option"
          value={selectedGuideline}
          onChange={handleGuidelineChange}
          options={guidelineOptions}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date of Birth" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required disabled={!isGuidelineSelected} />
            <Input label="Date of Diagnosis" type="date" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleChange} required disabled={!isGuidelineSelected} />
        </div>

        <CustomSelect label="Sub-diagnosis" name="subdiagnosis" placeholder="Select an option" value={formData.subdiagnosis} onChange={(value) => handleSelectChange('subdiagnosis', value)} options={subDiagnosisOptions.map(o => ({label: o, value: o}))} required disabled={!isGuidelineSelected} />
        
        {isGuidelineSelected && fields.includes('anaPositive') && <RadioGroup label="Antinuclear Antibody (ANA) Positive?" name="anaPositive" value={formData.anaPositive} onChange={handleChange} options={yesNoOptions} />}
        
        {isGuidelineSelected && fields.includes('methotrexate') && <RadioGroup label="On Methotrexate?" name="methotrexate" value={formData.methotrexate} onChange={handleChange} options={yesNoOptions} />}
        
        {isGuidelineSelected && fields.includes('biologicalTreatment') && <CustomSelect label="Biological Treatment" name="biologicalTreatment" placeholder="Select a treatment" value={formData.biologicalTreatment} onChange={(value) => handleSelectChange('biologicalTreatment', value)} options={BIOLOGICAL_TREATMENT_OPTIONS.map(o => ({label: o, value: o}))} required />}

        {isGuidelineSelected && fields.includes('discontinuedTreatment') && <RadioGroup label="Methotrexate or TNF inhibition discontinued within last 6 months?" name="discontinuedTreatment" value={formData.discontinuedTreatment} onChange={handleChange} options={yesNoOptions} />}

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <div className="pt-4 text-center">
          <Button type="submit" variant="secondary">Calculate Risk</Button>
        </div>
      </form>
    </Card>
  );
}

export default UveCheckFormPage;