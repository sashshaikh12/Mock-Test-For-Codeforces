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
                    <h2 className="text-2xl font-bold text-gray-800">{selectedQuestion.name}</h2>
                    <button 
                        onClick={handleCloseDetails}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors hover:cursor-pointer"
                    >
                        ← Back to Report
                    </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-700 inline-block mr-2">Problem Difficulty:</h4>
                            <span className="text-gray-600">{selectedQuestion.difficulty}</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 inline-block mr-2">Status:</h4>
                            <span className="text-gray-600">Not solved</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 inline-block mr-2">Time Spent:</h4>
                            <span className="text-gray-600">00:15:00</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 inline-block mr-2">Tags:</h4>
                            <span className="text-gray-600">{selectedQuestion.tags}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Performance Analysis</h3>
                    <p className="text-blue-600">
                        Detailed performance metrics for this specific question would appear here.
                        This could include time breakdown, comparison with peers, common mistakes, etc.
                    </p>
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

            <h1>Percentage: </h1>
            <h1>total Time Taken: </h1>

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

            {/* Bar Chart for time taken per question */}

            {data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
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
            

        </div>
    );
}

export default TestReport;