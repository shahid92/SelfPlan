
import React from 'react';

interface DailyNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const DailyNotes: React.FC<DailyNotesProps> = ({ notes, setNotes }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="Record your thoughts, progress, or any updates..."
      />
    </div>
  );
};

export default DailyNotes;
