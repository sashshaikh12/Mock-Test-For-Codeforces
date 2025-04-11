import {React, useState, useEffect} from "react";
import Navbar from "./Navbar";

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentNote, setCurrentNote] = useState("");
    const [questionNotes, setQuestionNotes] = useState({});

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
                
                // Initialize notes state from the fetched data
                const notesObj = {};
                data.favouriteQuestions.forEach(q => {
                    if (q.notes) {
                        notesObj[q._id] = q.notes;
                    }
                });
                setQuestionNotes(notesObj);
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
    
    const handleMakeNotes = async (question) => {
        try {
            setSelectedQuestion(question);
            
            // Fetch existing notes for this question
            const response = await fetch(`http://localhost:5000/get-question-notes/${question._id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const savedNote = data.notes || "";
                setCurrentNote(savedNote);
                setQuestionNotes(prev => ({
                    ...prev,
                    [question._id]: savedNote
                }));
            }
            
            setShowNotesModal(true);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };
    
    const handleSaveNotes = async () => {
        if (!selectedQuestion) return;
        
        try {
            // Update local state immediately
            const updatedNotes = {
                ...questionNotes,
                [selectedQuestion._id]: currentNote
            };
            setQuestionNotes(updatedNotes);
            
            // Save to backend
            const response = await fetch("http://localhost:5000/save-question-notes", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionId: selectedQuestion._id,
                    notes: currentNote,
                }),
            });
            
            if (response.status !== 200) {
                throw new Error("Failed to save notes");
            }
            
            setShowNotesModal(false);
        } catch (err) {
            console.error("Error saving notes:", err);
            // Optionally show error to user
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
                                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] hover:shadow-lg transition-all duration-200 relative"
                            >
                                {/* Difficulty indicator bar at top */}
                                <div 
                                    className={`h-1.5 w-full ${
                                        favourite.question.difficulty >= 1800 ? 'bg-red-500' :
                                        favourite.question.difficulty >= 1400 ? 'bg-orange-500' :
                                        favourite.question.difficulty >= 1000 ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                                ></div>
                                
                                {/* Remove button */}
                                <button 
                                    onClick={() => removeFavourite(favourite._id)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Remove from favorites"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                <div className="p-5">
                                    {/* Header with difficulty */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div 
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                favourite.question.difficulty >= 1800 ? 'bg-red-100 text-red-800' :
                                                favourite.question.difficulty >= 1400 ? 'bg-orange-100 text-orange-800' :
                                                favourite.question.difficulty >= 1000 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {favourite.question.difficulty || "?"}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* Title */}
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem] pr-6">
                                        {favourite.question.title || "Untitled Question"}
                                    </h2>
                                    
                                    {/* Tags */}
                                    {favourite.question.tags && favourite.question.tags.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {favourite.question.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {favourite.question.tags.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{favourite.question.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Notes preview
                                    {questionNotes[favourite._id] && (
                                        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm text-gray-700">
                                            <div className="flex items-center mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium text-yellow-800">Your Notes</span>
                                            </div>
                                            <p className="text-xs line-clamp-2 italic">{questionNotes[favourite._id].substring(0, 100)}{questionNotes[favourite._id].length > 100 ? '...' : ''}</p>
                                        </div>
                                    )} */}
                                    
                                    {/* Action buttons */}
                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <a 
                                            href={`https://codeforces.com/contest/${favourite.question.contestId}/problem/${favourite.question.index}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-center py-2 bg-blue-50 text-blue-700 rounded border border-blue-200 text-sm font-medium hover:bg-blue-100 transition-colors hover:cursor-pointer"
                                        >
                                            View Question
                                        </a>
                                        <button 
                                            onClick={() => handleMakeNotes(favourite)}
                                            className="text-center py-2 bg-green-50 text-green-700 rounded border border-green-200 text-sm font-medium hover:bg-green-100 transition-colors hover:cursor-pointer"
                                        >
                                            {questionNotes[favourite._id] ? "Edit Notes" : "Add Notes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Notes Modal */}
            {showNotesModal && selectedQuestion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">
                            Notes for {selectedQuestion.question.title}
                        </h2>
                        <textarea
                            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your notes here..."
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={() => setShowNotesModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNotes}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Favourites;