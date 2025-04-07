import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";

function History() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [notes, setNotes] = useState({});
    const [currentNote, setCurrentNote] = useState(""); // Add this state for the current note being edited
    const [showNotesModal, setShowNotesModal] = useState(false);

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
                    await fetchTestHistory(userData.userId);
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

    const fetchTestHistory = async (id) => {
        try {
            const response = await fetch("http://localhost:5000/mock-test-history", {
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
                // No tests found is not an error
                setTests([]);
                return;
            }
            
            if (response.status !== 200) {
                throw new Error("Failed to fetch mock test history");
            }
            
            const data = await response.json();
            if (data && data.tests) {
                // Reverse to show newest first
                setTests([...data.tests].reverse());
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleSeeDetails = (test) => {
        setSelectedTest(test);
        // You could navigate to a detailed view or show a modal
        window.open(`/test-report/${test.shareableLink}`, '_blank');
    };

    const handleMakeNotes = async (testId) => {
        try {
            const selectedTest = tests.find(test => test._id === testId);
            setSelectedTest(selectedTest);
            
            // Fetch existing notes for this test
            const response = await fetch(`http://localhost:5000/get-test-notes/${testId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const savedNote = data.notes || "";
                setCurrentNote(savedNote); // sets textarea value
                setNotes(prev => ({
                    ...prev,
                    [testId]: savedNote
                }));
                setShowNotesModal(true); // only open modal after data is ready
            }
            
            // Show the modal after getting the notes
            setShowNotesModal(true);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    const handleSaveNotes = () => {
        // Save the current note to the notes object
        setNotes(prev => ({
            ...prev,
            [selectedTest._id]: currentNote
        }));

        const sendnotes = async () => {
            try {
                const response = await fetch("http://localhost:5000/save-notes", {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        testId: selectedTest._id,
                        notes: currentNote, // Use currentNote directly
                    }),
                });
                
                if (response.status !== 200) {
                    throw new Error("Failed to save notes");
                }
                
                const data = await response.json();
                console.log(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };
        sendnotes();
        // Close the modal
        setShowNotesModal(false);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto mt-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your test history...</p>
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
            <div className="max-w-6xl mx-auto mt-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Mock Test History</h1>
                    <p className="text-gray-500 mt-2">Track your progress over time</p>
                </div>

                {tests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-600">No mock test history found. Start a new test to see it here!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tests.map((test, index) => (
                            <div 
                                key={test._id} 
                                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Mock Test #{tests.length - index}
                                        </h2>
                                        {/* <p className="text-gray-500 mt-1">
                                            {new Date(test.createdAt).toLocaleString()} • {test.questions.length} questions
                                        </p> */}
                                    </div>
                                    <div className="flex space-x-3 mt-4 md:mt-0">
                                        <button
                                            onClick={() => handleMakeNotes(test._id)}
                                            className="px-4 py-2 bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100 transition-colors hover:cursor-pointer"
                                        >
                                            Make Notes
                                        </button>
                                        <button
                                            onClick={() => handleSeeDetails(test)}
                                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors hover:cursor-pointer"
                                        >
                                            See Details
                                        </button>
                                    </div>
                                </div>
                                {/* Test summary */}
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-500">Questions</p>
                                        <p className="text-lg font-medium">{test.questions.length}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-500">Average Difficulty</p>
                                        <p className="text-lg font-medium">
                                            {test.questions.length > 0 
                                                ? Math.round(test.questions.reduce((sum, q) => sum + (q.difficulty || 0), 0) / test.questions.length)
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-500">Solved</p>
                                        <p className="text-lg font-medium">0/{test.questions.length}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-500">Total Time Taken</p>
                                        <p className="text-lg font-medium">50 minutes</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {showNotesModal && selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">
                        Notes for Test #{tests.length - tests.findIndex(t => t._id === selectedTest._id)}
                    </h2>
                    <textarea
                        className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your notes here..."
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    />
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

export default History;