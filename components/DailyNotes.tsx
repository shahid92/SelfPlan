import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface DailyNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
  onAnalyze: () => Promise<string>;
}

const DailyNotes: React.FC<DailyNotesProps> = ({ notes, setNotes, onAnalyze }) => {
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsLoadingAnalysis(true);
    setAnalysis('');
    setError('');
    try {
      const result = await onAnalyze();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to get analysis.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Record your thoughts, progress, or any updates..."
        />
      </div>

      <div>
        <button
          onClick={handleAnalyze}
          disabled={isLoadingAnalysis || !notes.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingAnalysis ? 'Analyzing...' : 'Get AI Insights'}
        </button>
      </div>

      {isLoadingAnalysis && <LoadingSpinner text="Thinking..." />}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {analysis && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">Your Daily Insights</h4>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyNotes;