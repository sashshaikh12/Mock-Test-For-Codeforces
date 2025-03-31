import React from "react";
import videoSrc from "../assets/Editorial.mp4"; 

function TestReport() {
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

            {/* Editorial Section */}
            <div className="mb-12">
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

            {/* Upcoming Sections Placeholder */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Detailed Analysis</h3>
                <p className="text-blue-600 mb-4">
                    Your personalized performance breakdown will appear here.
                </p>
              
            </div>
        </div>
    );
}

export default TestReport;
