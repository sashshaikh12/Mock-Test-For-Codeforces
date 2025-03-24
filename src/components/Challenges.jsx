import React from "react";

function Challenges() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-10">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Coding Challenges</h1>
                <p className="text-xl text-gray-600">Sharpen your skills with daily practice and speed challenges</p>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Daily Challenge Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Daily Challenge</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            A new problem every day to keep your skills sharp. Solve today's challenge to maintain your streak!
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-blue-800 mb-2">Today's Challenge:</h3>
                            <p className="text-gray-700">Problem Name (Difficulty: Medium)</p>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer">
                            Start Today's Challenge
                        </button>
                    </div>
                </div>

                {/* Speed Code Mode Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Speed Code Mode</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Race against the clock! Solve problems under tight time constraints (15-30 minutes) to improve your coding speed.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-purple-800 mb-2">Current Options:</h3>
                            <ul className="space-y-1 text-gray-700">
                                <li>• Easy (15 minutes)</li>
                                <li>• Medium (25 minutes)</li>
                                <li>• Hard (30 minutes)</li>
                            </ul>
                        </div>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer">
                            Start Speed Challenge
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-7">About Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-blue-600 mb-2">Daily Challenge</h4>
                        <p className="text-gray-600">
                            Each day we feature a new problem carefully selected to help you gradually improve your problem-solving skills. 
                            Maintain your streak by solving daily challenges consecutively!
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-purple-600 mb-2">Speed Code Mode</h4>
                        <p className="text-gray-600">
                            Simulate competition conditions with timed challenges. This mode helps you improve your coding speed, 
                            quick thinking, and ability to perform under pressure - essential skills for coding interviews and contests.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Challenges;