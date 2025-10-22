
import React from 'react';
import type { ScheduleTask } from '../types';
import ScheduleView from './ScheduleView';
import ProgressTracker from './ProgressTracker';
import DailyNotes from './DailyNotes';

interface DashboardProps {
  schedule: ScheduleTask[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleTask[]>>;
  dailyNotes: string;
  setDailyNotes: (notes: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ schedule, setSchedule, dailyNotes, setDailyNotes }) => {
  const handleToggleComplete = (id: string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content: Schedule */}
        <div className="lg:col-span-2">
            <ScheduleView tasks={schedule} onToggleComplete={handleToggleComplete} />
        </div>

        {/* Sidebar: Progress and Notes */}
        <div className="space-y-8">
          <ProgressTracker tasks={schedule} />
          <DailyNotes notes={dailyNotes} setNotes={setDailyNotes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
