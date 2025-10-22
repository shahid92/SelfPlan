import React, { useState, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { 
    generateSchedule, 
    generateImage, 
    getMealImagePrompt, 
    getWorkoutImagePrompt,
    editImage,
    analyzeDailyNotes
} from './services/geminiService';
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
    const [lastAttemptedData, setLastAttemptedData] = useState<UserData | null>(null);


    const handleReset = () => {
        setUserData(null);
        setSchedule([]);
        setDailyNotes('');
        setError(null);
        setLastAttemptedData(null);
        localStorage.clear();
    };

    const fetchAndSetImages = useCallback(async (tasks: ScheduleTask[]) => {
        try {
            const imagePromises = tasks.map(async (task) => {
                if ((task.type === 'Meal' || task.type === 'Workout') && !task.imageUrl) {
                    const prompt = task.type === 'Meal'
                        ? getMealImagePrompt(task.description)
                        : getWorkoutImagePrompt(task.description);
                    const imageUrl = await generateImage(prompt);
                    return { ...task, imageUrl, imageLoading: false };
                }
                return { ...task, imageLoading: false };
            });

            const tasksWithImages = await Promise.all(imagePromises);
            setSchedule(tasksWithImages);
        } catch (imageError) {
            console.error("A background error occurred while fetching images:", imageError);
        }
    }, [setSchedule]);


    const handleSetupComplete = useCallback(async (data: UserData) => {
        setIsLoading(true);
        setError(null);
        setLastAttemptedData(data); 

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
            });
            const { latitude } = position.coords;
            const weather = latitude > 20 ? "warm and sunny" : "cool and temperate";

            const generatedTasks = await generateSchedule(data, weather);
            
            const initialSchedule: ScheduleTask[] = generatedTasks.map((task, index) => ({
                ...task,
                id: `${Date.now()}-${index}`,
                completed: false,
                imageLoading: task.type === 'Meal' || task.type === 'Workout',
            }));
            
            setUserData(data);
            setSchedule(initialSchedule);
            setIsLoading(false);

            fetchAndSetImages(initialSchedule);

        } catch (err) {
            console.error(err);
            let specificMessage = 'An unknown error occurred. Please try again.';
            if (err instanceof GeolocationPositionError) {
                specificMessage = 'Could not get your location. Please enable location permissions in your browser settings and try again.';
            } else if (err instanceof Error) {
                if (err.message.includes('API')) {
                     specificMessage = 'There was a problem contacting the AI service. It might be busy. Please wait a moment and try again.';
                } else {
                    specificMessage = err.message;
                }
            }

            setError(specificMessage);
            setIsLoading(false);
            setUserData(null);
        }
    }, [setUserData, setSchedule, fetchAndSetImages, setLastAttemptedData]);
    
    const handleRetry = () => {
        if (lastAttemptedData) {
            handleSetupComplete(lastAttemptedData);
        }
    };

    const handleEditImage = async (taskId: string, prompt: string) => {
        const taskIndex = schedule.findIndex(t => t.id === taskId);
        if (taskIndex === -1 || !schedule[taskIndex].imageUrl) {
            throw new Error("Task or original image not found.");
        }
    
        const originalImageUrl = schedule[taskIndex].imageUrl!;
    
        setSchedule(currentSchedule =>
          currentSchedule.map(t =>
            t.id === taskId ? { ...t, imageLoading: true } : t
          )
        );
    
        try {
          const newImageUrl = await editImage(originalImageUrl, prompt);
    
          setSchedule(currentSchedule =>
            currentSchedule.map(t =>
              t.id === taskId
                ? { ...t, imageUrl: newImageUrl, imageLoading: false }
                : t
            )
          );
        } catch (err) {
          console.error("Failed to edit image:", err);
          setSchedule(currentSchedule =>
            currentSchedule.map(t =>
              t.id === taskId ? { ...t, imageLoading: false } : t
            )
          );
          throw err;
        }
    };

    const handleAnalyzeNotes = async (): Promise<string> => {
        if (!userData) {
          throw new Error("User data is not available.");
        }
        if (!dailyNotes.trim()) {
          return "Please write some notes before analyzing.";
        }
        return await analyzeDailyNotes(dailyNotes, schedule, userData);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-gray-800">
            <Header onReset={userData ? handleReset : undefined} />
            <main>
                {error && !isLoading && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                             <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">Couldn't Generate Plan</p>
                                    <p>{error}</p>
                                </div>
                                <button
                                    onClick={handleRetry}
                                    className="ml-4 flex-shrink-0 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 focus:ring-red-600 transition"
                                >
                                    Retry
                                </button>
                            </div>
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
                        onEditImage={handleEditImage}
                        onAnalyzeNotes={handleAnalyzeNotes}
                    />
                )}
            </main>
        </div>
    );
};

export default App;