import {React, useState, useEffect, PureComponent} from "react";
import videoSrc from "../assets/Editorial.mp4"; 
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function TestReport() {
    const { token } = useParams();
    const [testData, setTestData] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [data, setData] = useState([]);


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
        };
        fetchTest();
    }, [token]);

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
            <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedQuestion.title}</h2>
                        <p className="text-gray-500">Problem {testData.findIndex(q => q.id === selectedQuestion.id) + 1} of {testData.length}</p>
                    </div>
                    <button 
                        onClick={handleCloseDetails}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 hover:cursor-pointer"
                    >
                        ← Back to Report
                    </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Question Metadata */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Question Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Difficulty:</span>
                                <span className="text-gray-600 capitalize">{selectedQuestion.difficulty || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Status:</span>
                                <span className={`font-medium ${selectedQuestion.correct ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedQuestion.correct ? 'Solved' : 'Not solved'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Time Spent:</span>
                                <span className="text-gray-600">
                                    {selectedQuestion.time_taken ? `${selectedQuestion.time_taken} mins` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">Tags:</span>
                                <div className="flex flex-wrap justify-end gap-1 max-w-xs">
                                    {selectedQuestion.tags?.map(tag => (
                                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    )) || 'None'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Analysis */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Performance Analysis</h3>
                        <div className="space-y-4">
                            {selectedQuestion.correct ? (
                                <>
                                    <p className="text-green-700">
                                        <span className="font-semibold">Good work!</span> You solved this problem correctly in {selectedQuestion.time_taken || 'unknown'} minutes.
                                    </p>
                                    <p className="text-gray-700">
                                        Consider reviewing similar problems to reinforce your understanding of these concepts:
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                        <li>Practice more {selectedQuestion.difficulty}-level problems</li>
                                        <li>Explore variations of this problem type</li>
                                        <li>Review time optimization techniques</li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <p className="text-red-700">
                                        <span className="font-semibold">Let's improve:</span> You didn't solve this problem correctly.
                                    </p>
                                    <p className="text-gray-700">
                                        Here's how you can strengthen your skills in this area:
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                        <li>Study the problem's editorial solution</li>
                                        <li>Practice fundamental concepts related to this problem</li>
                                        <li>Attempt similar problems with gradual difficulty increase</li>
                                    </ul>
                                </>
                            )}
                            <a 
                                href={`https://codeforces.com/contest/${selectedQuestion.contestId}/problem/${selectedQuestion.index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:underline font-medium"
                            >
                                View editorial on Codeforces →
                            </a>
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
                    <h3 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Score</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">
                        50%
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

            {/* Bar Chart for time taken per question */}

            {data.length > 0 ? (
                <div style={{ width: '100%', height: '300px' }} className="my-16">
                    <ResponsiveContainer>
                        {/* Chart code here */}
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <XAxis 
                                dataKey="name" 
                                scale="point" 
                                padding={{ left: 50, right: 10 }}
                                angle={-45} // Angle the labels
                                textAnchor="end" // Align angled text better
                                height={60} // Give more room for angled labels
                                tick={{ fontSize: 12 }} // Smaller font on mobile
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="Time_Taken" fill="#8884d8" background={{ fill: '#9933ff' }} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-gray-500 text-center">No time data available for chart</p>
            )}

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
                    href="https://codeforces.com/problemset" 
                    target="_blank" 
                    rel="noopener noreferrer"
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