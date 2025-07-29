import {React, useState, useEffect, PureComponent} from "react";
import videoSrc from "../assets/Editorial.mp4"; 
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaStar, FaRegStar } from "react-icons/fa";


function TestReport() {
    const { token } = useParams();
    const [testData, setTestData] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [data, setData] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [favoriteMap, setFavoriteMap] = useState({});


    useEffect(() => {
        const fetchTest = async () => {
            const res = await fetch(`http://localhost:5000/api/tests/by-token/${token}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            setTestData(data.questions);
            // Transform data here
            const chartData = data.questions.map((question) => ({
                name: question.title ? question.title : "",
                Time_Taken: question.time_taken ? question.time_taken : 0,
            }));
            setData(chartData);
            fetchFavourites();
        };
        fetchTest();
    }, [token]);

    const fetchFavourites = async () => {
        try {
            const response = await fetch("http://localhost:5000/get-favourite-questions", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (response.status === 404) {
                // No favorites found
                setFavourites([]);
                setFavoriteMap({});
                return;
            }
            
            if (response.status !== 200) {
                throw new Error("Failed to fetch favourites");
            }
            
            const data = await response.json();``
            
            if (data && data.favouriteQuestions) {
                setFavourites(data.favouriteQuestions);
                
                // Create a map for quick lookup of favorites
                const newFavoriteMap = {};
                data.favouriteQuestions.forEach(fav => {
                    const key = `${fav.question.contestId}-${fav.question.index}`;
                    newFavoriteMap[key] = fav._id; // Store the favorite document ID for removal
                });
                setFavoriteMap(newFavoriteMap);
            }
        } catch (error) {
            console.error("Error fetching favourites:", error);
        }
    };

    const toggleFavorite = async (question, event) => {
        // Prevent the click from triggering parent elements

        if (event) {
            event.stopPropagation();
        }
        
        const favoriteKey = `${question.contestId}-${question.index}`;
        const isFavorite = favoriteMap[favoriteKey];
        
        try {
            if (isFavorite) {
                // Remove from favorites, implement logic here

                const response = await fetch("http://localhost:5000/remove-favourite-question", {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contestId: question.contestId,
                        index: question.index,
                    }),
                });
                if (response.status === 200) {
                    const newFavoriteMap = { ...favoriteMap };
                    delete newFavoriteMap[favoriteKey];
                    setFavoriteMap(newFavoriteMap);
                    
                    // Also update the favorites array
                    setFavourites(prev => prev.filter(fav => fav._id !== isFavorite));
                }


            } else {
                // Add to favorites
                const response = await fetch("http://localhost:5000/add-favourite-question", {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contestId: question.contestId,
                        index: question.index,
                        question: {
                            contestId: question.contestId,
                            index: question.index,
                            title: question.title,
                            difficulty: question.difficulty || 0,
                            tags: question.tags || []
                        }
                    }),
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // Update favorite map with the new favorite ID
                    setFavoriteMap(prev => ({
                        ...prev,
                        [favoriteKey]: result.favouriteQuestion._id
                    }));
                    
                    // Update favorites array
                    setFavourites(prev => [...prev, result.favouriteQuestion]);
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    if (!testData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                <p className="mt-4 text-gray-600">Fetching your test Report...</p>
            </div>
        );
    }

    const handleSeeDetails = (question) => {
        setSelectedQuestion(question);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedQuestion(null);
    };


    if (showDetails && selectedQuestion) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-4xl w-full mx-auto my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedQuestion.title}</h2>
                        <p className="text-sm text-gray-500">
                            Problem {testData.findIndex(q => q.id === selectedQuestion.id) + 1} of {testData.length}
                        </p>
                    </div>
                    <button
                        onClick={handleCloseDetails}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 hover:cursor-pointer"
                    >
                        ← Back to Report
                    </button>
                </div>

                {/* Details Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Question Metadata */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Question Details
                        </h3>
                        <div className="space-y-4">
                            {/* Difficulty */}
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Difficulty:</span>
                                <span className="text-gray-600 capitalize">
                                    {selectedQuestion.difficulty || 'Not specified'}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Status:</span>
                                <span
                                    className={`font-medium ${
                                        selectedQuestion.correct ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {selectedQuestion.correct ? 'Solved' : 'Not solved'}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">Tags:</span>
                                <div className="flex flex-wrap justify-end gap-1 max-w-xs">
                                    {selectedQuestion.tags?.map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    )) || 'None'}
                                </div>
                            </div>

                            {/* Most Relevant Tag */}
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Total Attempts:</span>
                                <span className="text-gray-600">
                                    4
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Actions
                        </h3>
                        <div className="space-y-4">
                            <a
                                href={`https://codeforces.com/contest/${selectedQuestion.contestId}/problem/${selectedQuestion.index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                View Question
                            </a>
                            <button
                                onClick={(e) => toggleFavorite(selectedQuestion, e)}
                                className={`block w-full text-center px-4 py-2 rounded-md transition-colors ${
                                    favoriteMap[`${selectedQuestion.contestId}-${selectedQuestion.index}`]
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {favoriteMap[`${selectedQuestion.contestId}-${selectedQuestion.index}`]
                                    ? 'Remove from Favorites'
                                    : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 relative inline-block pb-2">
                    Test Report
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full" />
                </h1>
                <p className="text-gray-500 mt-3">Detailed performance analysis and results</p>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
                    <h3 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Average Difficulty</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">
                        850
                    </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                    <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider">Correct</h3>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                        2
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                    <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Total Time</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                        50 mins
                    </p>
                </div>
            </div>

            {/* Questions List */}
            {testData && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Questions</h2>
                    <div className="space-y-4">
                        {testData.map((question, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl text-gray-800">{question.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Problem {index + 1} of {testData.length}</p>
                                </div>
                                <div className="flex space-x-2 hover:cursor-pointer">
                                    <a 
                                        href={`https://codeforces.com/contest/${question.contestId}/problem/${question.index}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                    >
                                        View Question
                                    </a>
                                    <button 
                                        onClick={() => handleSeeDetails(question)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors hover:cursor-pointer"
                                    >
                                        See Details
                                    </button>
                                    <button
                                        onClick={(e) => toggleFavorite(question, e)}
                                        className="px-2 py-2 rounded-full hover:bg-gray-100"
                                    >
                                        {favoriteMap[`${question.contestId}-${question.index}`] ? (
                                            <FaStar size={26} className="text-yellow-500" />
                                        ) : (
                                            <FaRegStar size={26} className="text-gray-400 hover:text-yellow-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Editorial Section */}
            <div className="mb-12 mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📚</span>
                    How to View Editorials for the Test Questions
                </h2>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <video 
                        className="w-full rounded-md shadow-sm"
                        controls
                        muted
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    <div className="mt-4 text-gray-600">
                        <p className="flex items-start mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3">1</span>
                            Click on the problem link to go to its Codeforces page
                        </p>
                        <p className="flex items-start mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3">2</span>
                            Scroll down to find the "Editorial" section
                        </p>
                        <p className="flex items-start">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3">3</span>
                            Different approaches are often explained with code samples
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <a 
                    href="/practice" 
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium text-center rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    Practice More Problems
                </a>
                <a 
                    href="/home" 
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-800 font-medium text-center rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                    Back to Home
                </a>
            </div>

        </div>
    );
}

export default TestReport;