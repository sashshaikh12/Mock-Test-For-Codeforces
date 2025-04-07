import {React, useState, useEffect} from "react";
import Navbar from "./Navbar";

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user data first
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:5000/user-data", {
                    method: "get",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (response.status !== 200) {
                    throw new Error("Failed to fetch user data");
                }
                
                const userData = await response.json();
                
                // Now fetch test history with userId
                if (userData.userId) {
                    await fetchFavouriteQuestions(userData.userId);
                }
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const fetchFavouriteQuestions = async (id) => {
        try {
            const response = await fetch("http://localhost:5000/get-favourite-questions", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: id,
                }),
            });
            
            if (response.status === 404) {
                setFavourites([]);
                return;
            }
            
            if (response.status !== 200) {
                throw new Error("Failed to fetch Favourite Questions");
            }
            
            const data = await response.json();
    
            if(data && data.favouriteQuestions) {
                setFavourites([...data.favouriteQuestions]);
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const removeFavourite = async (questionId) => {
        try {
            // Implement removal logic here
            // Update UI optimistically
            setFavourites(prev => prev.filter(q => q._id !== questionId));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto mt-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your favourite questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto mt-16 text-center">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p>Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Favourite Questions</h1>
                    <p className="text-gray-500 mt-2">Find the questions you want to revisit here!</p>
                </div>

                {favourites.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-600">No favourite questions found. Add some questions to your favourites!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {favourites.map((favourite) => (
                            <div 
                                key={favourite._id} 
                                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col h-full">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                        {favourite.question.title || "Untitled Question"}
                                    </h2>
                                    
                                    <div className="mb-3">
                                        {favourite.question.tags && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {favourite.question.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {favourite.question.tags.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                        +{favourite.question.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="text-sm text-gray-500 mb-2">
                                        Difficulty: <span className="font-medium">{favourite.question.difficulty || "Unknown"}</span>
                                    </div>
                                    
                                    <div className="mt-auto flex justify-between pt-4">
                                        <a 
                                            href={`https://codeforces.com/contest/${favourite.question.contestId}/problem/${favourite.question.index}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200 text-sm hover:bg-blue-100 transition-colors"
                                        >
                                            View Question
                                        </a>
                                        <button 
                                            onClick={() => removeFavourite(favourite._id)}
                                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded border border-red-200 text-sm hover:bg-red-100 transition-colors hover:cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favourites;