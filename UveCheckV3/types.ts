
export enum Guideline {
  Nordic = 'Nordic',
  US_Pakistan = 'US & Pakistan',
  Germany = 'Germany',
  Spain_Portugal = 'Spain & Portugal',
  UK = 'UK',
  Czech_Slovak = 'Czech & Slovak',
  Argentina = 'Argentina',
  MIWGUC = 'MIWGUC',
}

export enum RiskLevel {
  High = 'High Risk',
  Medium = 'Medium Risk',
  Low = 'Low Risk',
  NoRisk = 'No Risk',
}

export interface FormData {
  birthDate: string;
  diagnosisDate: string;
  subdiagnosis: string;
  anaPositive: 'y' | 'n' | 'na';
  methotrexate: 'y' | 'n' | 'na';
  discontinuedTreatment: 'y' | 'n' | 'na';
  biologicalTreatment: string;
}

export interface CalculationResult {
  riskLevel: RiskLevel;
  rawRecommendation: string;
  followUp: string;
  details: Record<string, string | number>;
}
