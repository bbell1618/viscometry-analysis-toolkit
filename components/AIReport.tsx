import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types';

interface AIReportProps {
  analysisResults: AnalysisResult[];
}

export const AIReport: React.FC<AIReportProps> = ({ analysisResults }) => {
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateReport = async () => {
    if (!apiKey) {
      setError('Please provide a valid Gemini API Key (or ensure process.env.API_KEY is set).');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are an expert Rheologist and Biopharmaceutical Scientist.
        Analyze the following synthetic viscosity analysis data for protein solutions:
        
        ${JSON.stringify(analysisResults, null, 2)}
        
        Metrics Explanation:
        - "flowBehaviorIndex" (n): <1 implies shear thinning, =1 Newtonian.
        - "clusterLengthScale": A toy metric derived from relaxation time and shear thinning degree. Higher = potential large clusters/aggregates.
        
        Task:
        1. Summarize the rheological behavior of each sample.
        2. Identify which sample shows the highest risk of protein instability or clustering.
        3. Provide a brief recommendation for formulation development (e.g., "Add excipients to Sample C").
        
        Keep it concise (under 200 words) and scientific.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setReport(response.text || 'No response generated.');
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.API_KEY) {
     // If env var is missing, simple UI to input it (usually handled by env, but for demo safety)
     // However, per instructions, we rely on process.env.API_KEY principally.
     // We will just show the button if available, or a message.
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <i className="fa-solid fa-robot text-indigo-600"></i> AI Rheologist Insight
        </h3>
        <button
          onClick={generateReport}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            loading 
              ? 'bg-indigo-200 text-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {loading ? 'Analyzing...' : 'Generate Analysis Report'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md mb-4 border border-red-200">
          <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
        </div>
      )}

      {report && (
        <div className="prose prose-sm prose-indigo max-w-none bg-white p-4 rounded-md shadow-sm border border-indigo-100">
           <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
             {report}
           </div>
        </div>
      )}
      
      {!report && !loading && !error && (
        <p className="text-indigo-400 text-sm italic">
          Click the button above to have Gemini 2.5 Flash analyze your flow curves and cluster metrics.
        </p>
      )}
    </div>
  );
};