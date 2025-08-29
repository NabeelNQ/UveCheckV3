
import { Guideline, FormData, CalculationResult, RiskLevel } from '../types';

// --- Date Helper Functions ---
const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    return new Date(dateStr);
};

const yearsSince = (dateStr: string): number => {
    const date = parseDate(dateStr);
    if (!date) return 0;
    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        years--;
    }
    return years;
};

const fractionalYearsSince = (dateStr: string): number => {
    const date = parseDate(dateStr);
    if (!date) return 0;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return diffTime / (1000 * 60 * 60 * 24 * 365.25);
};

const monthsSince = (dateStr: string): number => {
    const date = parseDate(dateStr);
    if (!date) return 0;
    const today = new Date();
    let months = (today.getFullYear() - date.getFullYear()) * 12;
    months -= date.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
};


const yearsBetween = (startStr: string, endStr: string): number => {
    const startDate = parseDate(startStr);
    const endDate = parseDate(endStr);
    if (!startDate || !endDate) return 0;
    
    let years = endDate.getFullYear() - startDate.getFullYear();
    const m = endDate.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < startDate.getDate())) {
        years--;
    }
    return years;
};


// --- Guideline Logic ---

const calculateNordic = (data: FormData): CalculationResult => {
    const age = yearsSince(data.birthDate);
    const timeu = yearsSince(data.diagnosisDate);
    const ageAtOnset = yearsBetween(data.birthDate, data.diagnosisDate);
    
    let subd = 0;
    if (["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(data.subdiagnosis)) subd = 1;
    else if (data.subdiagnosis === "Enthesitis related Arthritis") subd = 2;
    else if (["RF Positive Arthritis", "Systemic onset Arthritis"].includes(data.subdiagnosis)) subd = 3;

    let riskLevel: RiskLevel = RiskLevel.NoRisk;
    let recommendation = "None";
    let followup = "None";

    if (subd === 1) {
        if (ageAtOnset <= 6) {
            if (data.anaPositive === 'y' && data.methotrexate === 'n' && timeu <= 4) { recommendation = "Every 3 Months"; riskLevel = RiskLevel.High; }
            else if (data.anaPositive === 'y' && data.methotrexate === 'y' && timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
            else if (data.anaPositive === 'y' && data.methotrexate === 'n' && timeu > 4 && timeu < 7) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
            else if (data.anaPositive === 'y' && data.methotrexate === 'y' && timeu > 4 && timeu < 7) { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            else if (data.anaPositive === 'y' && timeu >= 7) { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            else if (data.anaPositive === 'n' && data.methotrexate === 'n' && timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
            else if (data.anaPositive === 'n' && timeu > 4) { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            followup = "Follow-up continues until 16 Years of age";
        } else {
            if (data.anaPositive === 'y' && data.methotrexate === 'n' && timeu <= 2) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
            else if (data.anaPositive === 'y' && timeu > 2) { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            else if (data.anaPositive === 'n') { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            followup = "Follow-up for 2 - 4 years, max 16 years of age";
        }
    } else if (subd === 2) {
        recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low;
        followup = ageAtOnset <= 6 ? "Follow-up for 4 - 7 years, max 16 years of age" : "Follow-up for 2 - 4 years, max 16 years of age";
    } else if (subd === 3) {
        recommendation = "Screen at Diagnosis"; riskLevel = RiskLevel.Low;
    }

    if (data.discontinuedTreatment === 'y') {
        riskLevel = RiskLevel.Medium;
        recommendation = "Every 6 Months";
    }

    if (data.biologicalTreatment !== "None / Other") {
        if (riskLevel === RiskLevel.High) { riskLevel = RiskLevel.Medium; recommendation = "Every 6 Months"; }
        else if (riskLevel === RiskLevel.Medium) { riskLevel = RiskLevel.Low; recommendation = "Every 12 Months"; }
    }

    return { riskLevel, rawRecommendation: recommendation, followUp: followup, details: { age, timeSinceDiagnosis: timeu, ageAtOnset } };
};

const calculateUsPakistan = (data: FormData): CalculationResult => {
    const age = yearsSince(data.birthDate);
    const timeu = yearsSince(data.diagnosisDate);
    const onsetAge = yearsBetween(data.birthDate, data.diagnosisDate);
    let recommendation = "None";
    let riskLevel = RiskLevel.NoRisk;
    let followup = "Follow-up continues into adulthood";

    const isHighRiskGroup = ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(data.subdiagnosis);

    if (isHighRiskGroup) {
        if (onsetAge <= 7) {
            if (data.anaPositive === 'y') {
                if (timeu <= 4) { recommendation = "Every 3 Months"; riskLevel = RiskLevel.High; }
                else if (timeu < 7) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                if (timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            }
        } else {
            if (data.anaPositive === 'y') {
                if (timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low;
            }
        }
    } else {
        recommendation = "Every 12 Months";
        riskLevel = RiskLevel.Low;
    }
    
    return { riskLevel, rawRecommendation: recommendation, followUp: followup, details: { age, timeSinceDiagnosis: timeu, ageAtOnset: onsetAge } };
};

const calculateGermany = (data: FormData): CalculationResult => {
    const age = yearsSince(data.birthDate);
    const timeu = yearsSince(data.diagnosisDate);
    const ageAtOnset = yearsBetween(data.birthDate, data.diagnosisDate);
    let recommendation = "None";
    let riskLevel = RiskLevel.NoRisk;
    const followup = "Follow-up continues for 7 Years from the diagnosis";
    const isHighRiskGroup = ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(data.subdiagnosis);

    if(isHighRiskGroup) {
        if (ageAtOnset <= 6) {
            if (data.anaPositive === 'y') {
                if (timeu <= 4) { recommendation = "Every 3 Months"; riskLevel = RiskLevel.High; }
                else { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
            } else {
                if (timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            }
        } else {
            if (data.anaPositive === 'y') {
                if (timeu <= 2) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low;
            }
        }
    } else {
        recommendation = "Every 12 Months";
        riskLevel = RiskLevel.Low;
    }
    
    return { riskLevel, rawRecommendation: recommendation, followUp: followup, details: { age, timeSinceDiagnosis: timeu, ageAtOnset } };
};

const calculateSpainPortugal = (data: FormData): CalculationResult => {
    const age = yearsSince(data.birthDate);
    const timeu = yearsSince(data.diagnosisDate);
    const onsetAge = yearsBetween(data.birthDate, data.diagnosisDate);
    let recommendation = "None";
    let riskLevel = RiskLevel.NoRisk;
    const followup = "Follow-up continues until 16 Years of age";
    const isHighRiskGroup = ["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis"].includes(data.subdiagnosis);

    if(isHighRiskGroup) {
        if (onsetAge <= 6) {
            if (data.anaPositive === 'y') {
                if (timeu <= 4) { recommendation = "Every 3 Months"; riskLevel = RiskLevel.High; }
                else if (timeu <= 7) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                if (timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            }
        } else {
            if (data.anaPositive === 'y') {
                if (timeu <= 2) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low;
            }
        }
    } else {
        recommendation = "Every 12 Months";
        riskLevel = RiskLevel.Low;
    }

    return { riskLevel, rawRecommendation: recommendation, followUp: followup, details: { age, timeSinceDiagnosis: timeu, ageAtOnset: onsetAge } };
};

const calculateUK = (data: FormData): CalculationResult => {
    const age = fractionalYearsSince(data.birthDate);
    const timeu = fractionalYearsSince(data.diagnosisDate);
    const ageAtOnset = age - timeu;

    if (["Systemic Onset Arthritis", "RF Positive Polyarthritis"].includes(data.subdiagnosis)) {
        return { riskLevel: RiskLevel.Low, rawRecommendation: "Screen at diagnosis", followUp: "As per clinician advice", details: { age: age.toFixed(1), timeSinceDiagnosis: timeu.toFixed(1), ageAtOnset: ageAtOnset.toFixed(1) } };
    }
    
    let group = 0;
    if (["Oligoarthritis", "Psoriatic Arthritis", "Enthesitis-related Arthritis"].includes(data.subdiagnosis)) group = 1;
    else if (data.subdiagnosis === "RF Negative Polyarthritis") group = 2;

    let riskLevel = RiskLevel.NoRisk;
    let recommendation = "None";
    let followup = "None";

    if (group === 1) {
        riskLevel = RiskLevel.High; recommendation = "every 3 - 4 Months";
        if (ageAtOnset < 3) followup = "Follow up continues for 8 years";
        else if (ageAtOnset < 5) followup = "Follow up continues for 6 years";
        else if (ageAtOnset < 9) followup = "Follow up continues for 3 years";
        else if (ageAtOnset < 12) followup = "Follow up continues for 1 year";
    } else if (group === 2) {
        riskLevel = RiskLevel.High; recommendation = "every 3 - 4 Months";
        if (data.anaPositive === 'y') {
            if (ageAtOnset < 6) followup = "Follow up continues for 5 years";
            else if (ageAtOnset < 9) followup = "Follow up continues for 2 years";
            else if (ageAtOnset < 12) followup = "Follow up continues for 1 year";
        } else {
            if (ageAtOnset < 7) followup = "Follow up continues for 5 years";
            else followup = "Follow up continues for 1 year";
        }
    }

    if(riskLevel !== RiskLevel.NoRisk) {
        recommendation = `Screen for every 2 months, for the first 6 months. Then screen ${recommendation}`;
    }

    return { riskLevel, rawRecommendation: recommendation, followUp: followup, details: { age: age.toFixed(1), timeSinceDiagnosis: timeu.toFixed(1), ageAtOnset: ageAtOnset.toFixed(1) } };
};

const calculateCzechSlovak = (data: FormData): CalculationResult => {
    const age = fractionalYearsSince(data.birthDate);
    const timeu = fractionalYearsSince(data.diagnosisDate);
    const ageAtOnset = age - timeu;
    
    if (["RF Positive Polyarthritis", "Systemic Onset Arthritis"].includes(data.subdiagnosis)) {
        return { riskLevel: RiskLevel.Medium, rawRecommendation: "Screen at diagnosis, then every 6 months until 18 years of age", followUp: "Until 18 years of age", details: { age: age.toFixed(1), timeSinceDiagnosis: timeu.toFixed(1), ageAtOnset: ageAtOnset.toFixed(1) } };
    }

    let riskLevel: RiskLevel = RiskLevel.NoRisk;
    let recommendation: string = "No specific recommendation";
    let followUp: string = "Not specified";

    const group1 = ["Oligoarthritis", "Psoriatic Arthritis", "RF Negative Polyarthritis"].includes(data.subdiagnosis);
    const group2 = data.subdiagnosis === "HLAB27+ Arthritis";

    if (group1 || (group2 && ageAtOnset < 6 && data.anaPositive === 'y')) {
        if (ageAtOnset < 6 && data.anaPositive === 'y') {
            if (timeu < 0.5) { recommendation = "Every 2 months"; riskLevel = RiskLevel.High; }
            else if (timeu <= 4) { recommendation = "Every 3 months"; riskLevel = RiskLevel.High; }
            else if (age < 18) { recommendation = "Every 6 months"; riskLevel = RiskLevel.Medium; }
            followUp = "Follow-up continue into adulthood";
        } else if (age > 18 && data.anaPositive === 'y') {
            recommendation = "Every 6-12 months"; riskLevel = RiskLevel.Low;
            followUp = "Follow-up continue into adulthood";
        } else if (ageAtOnset > 6 && data.anaPositive === 'n') {
            if (timeu < 4) { recommendation = "Every 3 months"; riskLevel = RiskLevel.High; }
            else { recommendation = "Every 6 months"; riskLevel = RiskLevel.Medium; }
            followUp = "Until 18 years of age";
        }
    } else if (group2) {
        if (ageAtOnset >= 6 && ageAtOnset <= 11) {
            recommendation = timeu < 4 ? "Every 3 months" : "Every 6 months";
            riskLevel = timeu < 4 ? RiskLevel.High : RiskLevel.Medium;
            followUp = "Until 18 years of age";
        } else if (ageAtOnset >= 11 && ageAtOnset < 18) {
            recommendation = "Every 6 months"; riskLevel = RiskLevel.Medium;
            followUp = "Until 18 years of age";
        } else if (ageAtOnset >= 18) {
            recommendation = "Every 6-12 months"; riskLevel = RiskLevel.Low;
            followUp = "Follow-up continue into adulthood";
        }
    }
    return { riskLevel, rawRecommendation: recommendation, followUp, details: { age: age.toFixed(1), timeSinceDiagnosis: timeu.toFixed(1), ageAtOnset: ageAtOnset.toFixed(1) } };
};


const calculateArgentina = (data: FormData): CalculationResult => {
    const ageYears = yearsSince(data.birthDate);
    const diagYears = yearsSince(data.diagnosisDate);
    const ageOnsetYears = yearsBetween(data.birthDate, data.diagnosisDate);

    let riskLevel: RiskLevel = RiskLevel.NoRisk;
    let recommendation: string = "None";
    const followUp = "Follow-up continues until 21 Years of age";
    const isSystemic = data.subdiagnosis === "Systemic onset Arthritis";

    if (isSystemic) {
        recommendation = "Every 12 Months";
        riskLevel = RiskLevel.Low;
    } else {
        if (ageOnsetYears <= 6) {
            if (data.anaPositive === 'y') {
                if (diagYears <= 4) { recommendation = "Every 3 Months"; riskLevel = RiskLevel.High; }
                else if (diagYears <= 7) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            } else {
                if (diagYears <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
                else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
            }
        } else {
            recommendation = "Every 12 Months";
            riskLevel = RiskLevel.Low;
        }
    }

    return { riskLevel, rawRecommendation: recommendation, followUp, details: { currentAge: ageYears, timeSinceDiagnosis: diagYears, ageAtOnset: ageOnsetYears } };
};

const calculateMiwguc = (data: FormData): CalculationResult => {
    const ageAtDiagnosis = yearsBetween(data.birthDate, data.diagnosisDate);
    const timeu = yearsSince(data.diagnosisDate);
    
    if (data.subdiagnosis === "Systemic-onset Arthritis") {
        return { riskLevel: RiskLevel.NoRisk, rawRecommendation: "No screening required", followUp: "As per clinician advice", details: { ageAtDiagnosis, timeSinceDiagnosis: timeu } };
    }

    let riskLevel = RiskLevel.NoRisk;
    let recommendation = "None";
    const followUp = "Follow-up continues into adulthood";

    if (ageAtDiagnosis < 7) {
        if (timeu <= 1) { recommendation = "Every 2 Months"; riskLevel = RiskLevel.High; }
        else if (timeu <= 4) { recommendation = "Every 3-4 Months"; riskLevel = RiskLevel.High; }
        else if (timeu <= 7) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
        else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
    } else {
        if (timeu <= 1) { recommendation = "Every 3-4 Months"; riskLevel = RiskLevel.High; }
        else if (timeu <= 4) { recommendation = "Every 6 Months"; riskLevel = RiskLevel.Medium; }
        else { recommendation = "Every 12 Months"; riskLevel = RiskLevel.Low; }
    }
    
    return { riskLevel, rawRecommendation: recommendation, followUp, details: { ageAtDiagnosis, timeSinceDiagnosis: timeu } };
};


export const calculateRisk = (guideline: Guideline, data: FormData): CalculationResult => {
    switch (guideline) {
        case Guideline.Nordic: return calculateNordic(data);
        case Guideline.US_Pakistan: return calculateUsPakistan(data);
        case Guideline.Germany: return calculateGermany(data);
        case Guideline.Spain_Portugal: return calculateSpainPortugal(data);
        case Guideline.UK: return calculateUK(data);
        case Guideline.Czech_Slovak: return calculateCzechSlovak(data);
        case Guideline.Argentina: return calculateArgentina(data);
        case Guideline.MIWGUC: return calculateMiwguc(data);
        default:
            throw new Error('Invalid guideline selected');
    }
};
