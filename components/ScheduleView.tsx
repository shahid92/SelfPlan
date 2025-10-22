
import React from 'react';
import type { ScheduleTask } from '../types';
import ScheduleItem from './ScheduleItem';

interface ScheduleViewProps {
    tasks: ScheduleTask[];
    onToggleComplete: (id: string) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ tasks, onToggleComplete }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Daily Plan</h3>
            {tasks.length > 0 ? (
                 <div className="space-y-4">
                    {tasks.map(task => (
                        <ScheduleItem key={task.id} task={task} onToggleComplete={onToggleComplete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Your personalized schedule will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ScheduleView;
