export interface UserData {
  height: number;
  weight: number;
  workout: string;
  workoutDuration: number;
  workoutIntensity: 'Low' | 'Medium' | 'High';
  goal: string;
}

export type ScheduleTaskType = 'Meal' | 'Workout' | 'Hydration' | 'Mindfulness' | 'Other';

export interface ScheduleTask {
  id: string;
  time: string;
  type: ScheduleTaskType;
  title: string;
  description: string;
  completed: boolean;
  imageUrl?: string;
  imageLoading?: boolean;
}
