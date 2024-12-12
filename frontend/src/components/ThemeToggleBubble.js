import React, { useEffect, useState } from "react";

const ThemeToggleBubble = () => {

    const [isDarkMode, setIsDarkMode] = useState(localStorage.theme == 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`fixed bottom-6 right-6 ${isDarkMode ? 'bg-white dark:bg-gray-800' : 'bg-gray-800'} p-2 rounded-full shadow-lg`}>
            <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={isDarkMode} onChange={toggleTheme} />
                <div className={`w-8 h-4 bg-gray-200 rounded-full flex items-center transition-all peer-checked:bg-primary-500 ${isDarkMode ? 'bg-white' : ''}`}>
                    <div className={`w-4 h-4 bg-gray-700 rounded-full shadow transform transition-transform ${isDarkMode ? 'translate-x-4' : ''} ${isDarkMode ? 'bg-white' : ''}`}></div>
                </div>
            </label>
        </div>
    )

}

export default ThemeToggleBubble;