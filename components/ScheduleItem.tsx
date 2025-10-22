
import React from 'react';
import type { ScheduleTask, ScheduleTaskType } from '../types';
import { UtensilsIcon, DumbbellIcon, WaterDropIcon, BrainIcon, SunIcon } from './icons';

interface ScheduleItemProps {
  task: ScheduleTask;
  onToggleComplete: (id: string) => void;
}

const getIcon = (type: ScheduleTaskType) => {
    const iconClass = "w-6 h-6 mr-4";
    switch(type) {
        case 'Meal': return <UtensilsIcon className={`${iconClass} text-orange-500`} />;
        case 'Workout': return <DumbbellIcon className={`${iconClass} text-red-500`} />;
        case 'Hydration': return <WaterDropIcon className={`${iconClass} text-blue-500`} />;
        case 'Mindfulness': return <BrainIcon className={`${iconClass} text-purple-500`} />;
        default: return <SunIcon className={`${iconClass} text-yellow-500`} />;
    }
};

const ScheduleItem: React.FC<ScheduleItemProps> = ({ task, onToggleComplete }) => {
  return (
    <div className={`p-4 rounded-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} border`}>
      <div className="flex-1 flex items-start">
        <div className="flex items-center h-5 mt-1">
          <input
            id={task.id}
            name={task.id}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="ml-4 flex-1">
            <div className="flex items-center">
                {getIcon(task.type)}
                <div>
                    <p className="text-sm font-bold text-gray-500">{task.time} - {task.title}</p>
                    <label htmlFor={task.id} className={`font-medium cursor-pointer ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {task.description}
                    </label>
                </div>
            </div>
        </div>
      </div>
      
      {task.imageLoading || task.imageUrl ? (
        <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
            {task.imageLoading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            )}
            {task.imageUrl && !task.imageLoading && (
                <img src={task.imageUrl} alt={task.description} className="w-full h-full object-cover" />
            )}
        </div>
      ) : null}
    </div>
  );
};

export default ScheduleItem;
