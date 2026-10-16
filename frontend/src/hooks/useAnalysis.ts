import { useState, useCallback } from 'react';
import { api, APIError } from '../services/api';
import type { AnalysisResponse } from '../types';

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading'; stage: string }
  | { status: 'success'; data: AnalysisResponse }
  | { status: 'error'; message: string };

const STAGES = [
  'Validating resume…',
  'Extracting resume text…',
  'Understanding job requirements…',
  'Comparing skills and experience…',
  'Generating recommendations…',
  'Preparing your report…',
];

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  const analyze = useCallback(async (
    file: File,
    jobDescription: string,
    jobTitle?: string,
    companyName?: string,
    includeRoadmap = true,
    includeInterviewQuestions = true,
  ) => {
    setState({ status: 'loading', stage: STAGES[0] });

    // Cycle through UI stages while the real request runs
    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, STAGES.length - 1);
      setState({ status: 'loading', stage: STAGES[stageIdx] });
    }, 3000);

    try {
      const result = await api.analyze(
        file, jobDescription, jobTitle, companyName,
        includeRoadmap, includeInterviewQuestions,
      );
      clearInterval(interval);
      setState({ status: 'success', data: result });
      return result;
    } catch (err) {
      clearInterval(interval);
      const msg = err instanceof APIError ? err.message : 'An unexpected error occurred.';
      setState({ status: 'error', message: msg });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, analyze, reset };
}
