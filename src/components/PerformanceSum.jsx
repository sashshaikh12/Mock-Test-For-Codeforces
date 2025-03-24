import React from "react";

function PerformanceSum() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="flex">
            <img 
              src="src/assets/performance_analysis.svg" 
              className="h-120 w-auto object-contain drop-shadow-lg" 
              alt="Performance analysis illustration"
            />    
          </div>
          
          {/* Stats Section */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-teal-800 mb-6">
              Performance Analysis
            </h1>
            
            <ul className="space-y-6">
              <li className="flex items-center">
                <div className="bg-teal-200 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-700">Total Tests Taken: <span className="text-teal-600 ml-2">12</span></span>
              </li>
              
              <li className="flex items-center">
                <div className="bg-teal-200 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-700">Best Performing Topic: <span className="text-teal-600 ml-2">Greedy Algorithms</span></span>
              </li>
              
              <li className="flex items-center">
                <div className="bg-teal-200 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-700">Weak Topic: <span className="text-teal-600 ml-2">Dynamic Programming</span></span>
              </li>
              
              <li className="flex items-center">
                <div className="bg-teal-200 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-700">Accuracy Rate: <span className="text-teal-600 ml-2">78%</span></span>
              </li>
              
              <li className="flex items-center">
                <div className="bg-teal-200 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-700">Total Problems Solved: <span className="text-teal-600 ml-2">84</span></span>
              </li>
            </ul>
            
            <button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 hover:cursor-pointer">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceSum;