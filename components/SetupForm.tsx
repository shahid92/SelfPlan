import React, { useState } from 'react';
import type { UserData } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface SetupFormProps {
  onSetupComplete: (data: UserData) => void;
  isLoading: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onSetupComplete, isLoading }) => {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [workout, setWorkout] = useState('Jogging');
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutIntensity, setWorkoutIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [goal, setGoal] = useState('Lose weight and improve cardiovascular health');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSetupComplete({
      height: parseFloat(height),
      weight: parseFloat(weight),
      workout,
      workoutDuration: parseInt(workoutDuration, 10),
      workoutIntensity,
      goal,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Personalized Plan
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us a bit about yourself to get started.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLoading ? (
            <LoadingSpinner text="Weaving your wellness plan..." />
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <div className="mt-1">
                  <input id="height" name="height" type="number" required value={height} onChange={e => setHeight(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <div className="mt-1">
                  <input id="weight" name="weight" type="number" required value={weight} onChange={e => setWeight(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-700">Your Daily Workout</legend>
                <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="workout" className="sr-only">Workout Type</label>
                            <input id="workout" name="workout" type="text" placeholder="e.g., Jogging, Yoga" required value={workout} onChange={e => setWorkout(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="workoutDuration" className="sr-only">Duration (minutes)</label>
                            <div className="relative">
                                <input id="workoutDuration" name="workoutDuration" type="number" placeholder="Duration" required value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm">min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 sr-only">Workout Intensity</label>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                        {(['Low', 'Medium', 'High'] as const).map((intensity) => (
                            <div key={intensity}>
                            <label
                                htmlFor={`intensity-${intensity}`}
                                className={`flex items-center justify-center rounded-md py-2 px-3 text-sm font-medium uppercase cursor-pointer focus:outline-none transition-colors ${
                                workoutIntensity === intensity
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                type="radio"
                                id={`intensity-${intensity}`}
                                name="workoutIntensity"
                                value={intensity}
                                checked={workoutIntensity === intensity}
                                onChange={() => setWorkoutIntensity(intensity)}
                                className="sr-only"
                                aria-labelledby={`intensity-${intensity}-label`}
                                />
                                <span id={`intensity-${intensity}-label`}>{intensity}</span>
                            </label>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </fieldset>

              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Primary Health Goal</label>
                <div className="mt-1">
                  <textarea id="goal" name="goal" rows={3} required value={goal} onChange={e => setGoal(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoading}>
                  Generate Plan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
