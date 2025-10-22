
import React from 'react';
import type { ScheduleTask } from '../types';

interface ProgressTrackerProps {
  tasks: ScheduleTask[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Progress</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
          <circle 
            className="text-indigo-600" 
            strokeWidth="10" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="52" 
            cx="60" 
            cy="60"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{progress}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>
  );
};

export default ProgressTracker;
