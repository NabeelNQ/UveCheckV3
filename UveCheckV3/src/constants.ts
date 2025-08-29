import { Guideline } from './types';

export const GUIDELINES = [
  { id: Guideline.Nordic, name: 'Nordic' },
  { id: Guideline.US_Pakistan, name: 'US & Pakistan' },
  { id: Guideline.Germany, name: 'Germany' },
  { id: Guideline.Spain_Portugal, name: 'Spain & Portugal' },
  { id: Guideline.UK, name: 'UK' },
  { id: Guideline.Czech_Slovak, name: 'Czech & Slovak' },
  { id: Guideline.Argentina, name: 'Argentina' },
  { id: Guideline.MIWGUC, name: 'MIWGUC' },
];

export const SUBDIAGNOSIS_OPTIONS: Record<Guideline, string[]> = {
    [Guideline.Nordic]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic onset Arthritis", "Undifferentiated Arthritis"],
    [Guideline.US_Pakistan]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic onset Arthritis", "Undifferentiated Arthritis"],
    [Guideline.Germany]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic onset Arthritis", "Undifferentiated Arthritis"],
    [Guideline.Spain_Portugal]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic onset Arthritis", "Undifferentiated Arthritis"],
    [Guideline.UK]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Enthesitis-related Arthritis", "RF Positive Polyarthritis", "Systemic Onset Arthritis"],
    [Guideline.Czech_Slovak]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Polyarthritis", "Systemic Onset Arthritis", "HLAB27+ Arthritis"],
    [Guideline.Argentina]: ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic onset Arthritis"],
    [Guideline.MIWGUC]: ["Juvenile Idiopathic Arthritis", "Systemic-onset Arthritis"],
};

export const BIOLOGICAL_TREATMENT_OPTIONS: string[] = ["None / Other", "TNF - Inhibitors", "Adalimumab", "Certolizumab", "Golimumab", "Infliximab"];
