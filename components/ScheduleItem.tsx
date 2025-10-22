import React, { useState } from 'react';
import type { ScheduleTask, ScheduleTaskType } from '../types';
import { UtensilsIcon, DumbbellIcon, WaterDropIcon, BrainIcon, SunIcon } from './icons';

interface ScheduleItemProps {
  task: ScheduleTask;
  onToggleComplete: (id: string) => void;
  onEditImage: (taskId: string, prompt: string) => Promise<void>;
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

const ScheduleItem: React.FC<ScheduleItemProps> = ({ task, onToggleComplete, onEditImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditingImage, setIsEditingImage] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt || isEditingImage) return;
    setIsEditingImage(true);
    try {
      await onEditImage(task.id, editPrompt);
      setIsEditing(false);
      setEditPrompt('');
    } catch (error) {
      console.error(error);
      // Optional: Show an alert to the user
    } finally {
      setIsEditingImage(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} border`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Left side: Checkbox and Task Info */}
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
        
        {/* Right side: Image and Edit UI */}
        {(task.imageLoading || task.imageUrl) && (task.type === 'Meal' || task.type === 'Workout') ? (
          <div className="w-full sm:w-40 flex-shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden relative">
                {(task.imageLoading || isEditingImage) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
                {task.imageUrl && (
                    <img src={task.imageUrl} alt={task.description} className="w-full h-full object-cover" />
                )}
            </div>
             {task.imageUrl && !task.imageLoading && (
              <button onClick={() => setIsEditing(!isEditing)} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition">
                {isEditing ? 'Cancel Edit' : 'Edit Image'}
              </button>
            )}
          </div>
        ) : null}
      </div>

      {isEditing && (
        <form onSubmit={handleEditSubmit} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe your edit, e.g., 'make it B&W'"
              className="flex-grow appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button type="submit" disabled={isEditingImage || !editPrompt} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {isEditingImage ? 'Generating...' : 'Apply'}
            </button>
        </form>
      )}
    </div>
  );
};

export default ScheduleItem;