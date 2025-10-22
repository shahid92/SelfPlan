
import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { generateSchedule, generateImage, getMealImagePrompt, getWorkoutImagePrompt } from './services/geminiService';
import type { UserData, ScheduleTask } from './types';
import Header from './components/Header';
import SetupForm from './components/SetupForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [userData, setUserData] = useLocalStorage<UserData | null>('userData', null);
    const [schedule, setSchedule] = useLocalStorage<ScheduleTask[]>('schedule', []);
    const [dailyNotes, setDailyNotes] = useLocalStorage<string>('dailyNotes', '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = () => {
        setUserData(null);
        setSchedule([]);
        setDailyNotes('');
        setError(null);
        localStorage.clear();
    };

    const fetchAndSetImages = useCallback(async (tasks: ScheduleTask[]) => {
        const imagePromises = tasks.map(async (task) => {
            if (task.type === 'Meal' || task.type === 'Workout') {
                const prompt = task.type === 'Meal'
                    ? getMealImagePrompt(task.description)
                    : getWorkoutImagePrompt(task.description);
                const imageUrl = await generateImage(prompt);
                return { ...task, imageUrl, imageLoading: false };
            }
            return task;
        });

        const tasksWithImages = await Promise.all(imagePromises);
        setSchedule(tasksWithImages);
    }, [setSchedule]);


    const handleSetupComplete = useCallback(async (data: UserData) => {
        setIsLoading(true);
        setError(null);
        setUserData(data);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;
            // Simple weather context, Gemini can infer from this
            const weather = latitude > 20 ? "warm and sunny" : "cool and temperate";

            const generatedTasks = await generateSchedule(data, weather);
            
            const initialSchedule: ScheduleTask[] = generatedTasks.map((task, index) => ({
                ...task,
                id: `${Date.now()}-${index}`,
                completed: false,
                imageLoading: task.type === 'Meal' || task.type === 'Workout',
            }));
            
            setSchedule(initialSchedule);
            setIsLoading(false);

            // Fetch images in the background
            fetchAndSetImages(initialSchedule);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate your plan. ${errorMessage}`);
            setIsLoading(false);
            // Don't keep user data if plan generation fails
            setUserData(null);
        }
    }, [setUserData, setSchedule, fetchAndSetImages]);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-800">
            <Header onReset={userData ? handleReset : undefined} />
            <main>
                {error && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
                {!userData ? (
                    <SetupForm onSetupComplete={handleSetupComplete} isLoading={isLoading} />
                ) : (
                    <Dashboard
                        schedule={schedule}
                        setSchedule={setSchedule}
                        dailyNotes={dailyNotes}
                        setDailyNotes={setDailyNotes}
                    />
                )}
            </main>
        </div>
    );
};

export default App;
