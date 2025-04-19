import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import useDebounce from "../Debounce";

function Practice() {
    const [name, setName] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [rating, setRating] = useState();
    const [allProblems, setAllProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 20;

    const debouncedSearchValue = useDebounce(name, 500);

    const tags = ["binary search", "bitmasks", "brute force", "combinatorics", "constructive algorithms", "data structures", "dfs and similar", "divide and conquer", "dp", "dsu", "games", "geometry", "graphs", "greedy", "math", "number theory", "probabilities", "shortest paths", "sortings", "strings", "ternary search", "trees", "two pointers"];

    const ratings = Array.from({ length: 15 }, (_, i) => 800 + i * 100);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const toggleRating = (rate) => {
        if (rating === rate) {
            setRating(null);
        } else {
            setRating(rate);
        }
    };

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch("http://localhost:5000/codeforces-all-questions");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setAllProblems(data);
                    setFilteredProblems(data);
                } else if (Array.isArray(data.problems)) {
                    setAllProblems(data.problems);
                    setFilteredProblems(data.problems);
                } else {
                    console.error("Invalid data format from API:", data);
                }
            } catch (error) {
                console.error("Failed to fetch problems", error);
            }
        };

        fetchProblems();
    }, []);

    useEffect(() => {
        let result = allProblems;

        if (debouncedSearchValue) {
            result = result.filter(problem =>
                problem.name.toLowerCase().includes(debouncedSearchValue.toLowerCase())
            );
        }

        if (selectedTags.length > 0) {
            result = result.filter(problem =>
                problem.tags.some(tag => selectedTags.includes(tag))
            );
        }

        if (rating) {
            result = result.filter(problem => problem.rating === rating);
        }

        setFilteredProblems(result);
        setCurrentPage(1);
    }, [debouncedSearchValue, selectedTags, rating, allProblems]);

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

    // Function to determine difficulty level color based on rating
    const getDifficultyColor = (rating) => {
        if (rating < 1000) return "bg-green-50 text-green-700 border-green-200";
        if (rating < 1400) return "bg-blue-50 text-blue-700 border-blue-200";
        if (rating < 1800) return "bg-purple-50 text-purple-700 border-purple-200";
        if (rating < 2200) return "bg-orange-50 text-orange-700 border-orange-200";
        return "bg-red-50 text-red-700 border-red-200";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Practice Problems</h1>
                    <p className="text-gray-600 mt-2">Find and solve problems to improve your coding skills</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                    <div className="mb-6">
                        <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Problems
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search by problem name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-md font-semibold text-gray-700">Filter by Tags</h3>
                            {selectedTags.length > 0 && (
                                <button 
                                    onClick={() => setSelectedTags([])} 
                                    className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                                >
                                    Clear all tags
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        selectedTags.includes(tag)
                                            ? "bg-teal-100 text-teal-800 border border-teal-200 shadow-sm"
                                            : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-md font-semibold text-gray-700">Filter by Rating</h3>
                            {rating && (
                                <button 
                                    onClick={() => setRating(null)} 
                                    className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                                >
                                    Clear rating
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            {ratings.map(rate => {
                                // Determine color based on rating difficulty
                                let buttonStyle = "";
                                if (rating === rate) {
                                    if (rate < 1000) buttonStyle = "bg-green-600 text-white border-green-600";
                                    else if (rate < 1400) buttonStyle = "bg-blue-600 text-white border-blue-600";
                                    else if (rate < 1800) buttonStyle = "bg-purple-600 text-white border-purple-600"; 
                                    else if (rate < 2200) buttonStyle = "bg-orange-600 text-white border-orange-600";
                                    else buttonStyle = "bg-red-600 text-white border-red-600";
                                } else {
                                    if (rate < 1000) buttonStyle = "bg-white text-green-700 border-gray-200 hover:border-green-300";
                                    else if (rate < 1400) buttonStyle = "bg-white text-blue-700 border-gray-200 hover:border-blue-300";
                                    else if (rate < 1800) buttonStyle = "bg-white text-purple-700 border-gray-200 hover:border-purple-300";
                                    else if (rate < 2200) buttonStyle = "bg-white text-orange-700 border-gray-200 hover:border-orange-300";
                                    else buttonStyle = "bg-white text-red-700 border-gray-200 hover:border-red-300";
                                }
                                
                                return (
                                    <button
                                        key={rate}
                                        onClick={() => toggleRating(rate)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${buttonStyle}`}
                                    >
                                        {rate}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Available Problems</h2>
                        <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                            Showing {indexOfFirstProblem + 1}-{Math.min(indexOfLastProblem, filteredProblems.length)} of {filteredProblems.length} problems
                        </span>
                    </div>
                    
                    {currentProblems.length > 0 ? (
                        <div className="space-y-4">
                            {currentProblems.map((problem, index) => (
                                <div 
                                    key={index} 
                                    className="w-full p-5 border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-200 group bg-white"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(problem.rating)}`}>
                                                    {problem.rating}
                                                </span>
                                                <h3 className="font-medium text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                                                    <a
                                                        href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {problem.name}
                                                    </a>
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-xs text-gray-500 mr-1">Tags:</span>
                                                {problem.tags.slice(0, 4).map((tag, i) => (
                                                    <span 
                                                        key={i} 
                                                        className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {problem.tags.length > 4 && (
                                                    <span className="text-xs text-gray-500">+{problem.tags.length - 4} more</span>
                                                )}
                                            </div>
                                        </div>
                                        <a
                                            href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shadow-sm hover:shadow flex items-center justify-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                            Solve
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 mt-4">No problems found matching your filters</p>
                            <button 
                                onClick={() => {
                                    setName("");
                                    setSelectedTags([]);
                                    setRating(800);
                                }} 
                                className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}

                    {filteredProblems.length > problemsPerPage && (
                        <div className="flex justify-between items-center mt-8 border-t pt-6 border-gray-100">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                            <div className="flex items-center">
                                {Array.from({ length: Math.min(5, Math.ceil(filteredProblems.length / problemsPerPage)) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-8 h-8 mx-1 flex items-center justify-center rounded-full ${
                                                currentPage === pageNumber
                                                    ? 'bg-teal-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                                {Math.ceil(filteredProblems.length / problemsPerPage) > 5 && (
                                    <span className="mx-1 text-gray-500">...</span>
                                )}
                            </div>
                            <button
                                disabled={indexOfLastProblem >= filteredProblems.length}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-4 py-2 rounded-lg flex items-center ${indexOfLastProblem >= filteredProblems.length ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Practice;