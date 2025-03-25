import React from "react";

function MockTestSetup() {
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700">Start Mock Test</h1>
        <p className="text-gray-600 mt-2">Set your preferences and review the rules</p>
      </div>

      {/* Verification Section */}
      <div className="mb-8 p-6 bg-teal-50 rounded-lg border border-teal-200">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">Step 1: Verify Codeforces Profile</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Codeforces username"
              className="flex-grow px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
              Verify
            </button>
          </div>

          {/* Verification URL Display */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Verification Steps:</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 break-all">
                Problem link will be given here:
              </span>
              <button className="shrink-0 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                Copy
              </button>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-blue-700">
              <li>Enter your codeforces profile and click verify</li>
              <li>You will get link to a question on codeforces</li>
              <li>Submit any code that produces a compilation error to the above problem</li>
              <li>Return here and click the confirmation button below</li>
            </ol>
          </div>

          {/* Confirmation Button */}
          <div className="flex justify-center">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Confirm Verification
            </button>
          </div>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">Step 2: Test Preferences</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Difficulty Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Range</label>
            <div className="flex gap-2">
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1">Lower Bound</label>
                <input
                  type="number"
                  placeholder="e.g. 800"
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1">Upper Bound</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Time Limit */}
          <div className="flex flex-col justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              placeholder="e.g. 120"
              className="w-full px-3 py-2 border rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Tags Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Problem Tags</label>
          <div className="flex flex-wrap gap-2">
            {['greedy', 'dp', 'math', 'graphs', 'binary search'].map(tag => (
              <button
                key={tag}
                className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm hover:bg-teal-200 transition hover:cursor-pointer"
              >
                {tag}
              </button>
            ))}
            <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition hover:cursor-pointer">
              Mixed
            </button>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Rules</h2>
        <div className="max-h-40 overflow-y-auto pr-2">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>4 problems will be selected based on your configuration</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Timer starts immediately and cannot be paused</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>The mock assessment session will end when you have successfully submitted a correct answer for each question, the allotted time has expired, or you end the session manually.</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>You can use a local IDE, but AI-generated solutions or predefined templates are not allowed.</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>It’s recommended to use online IDEs like CodeChef IDE for a seamless experience.</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Only accepted submissions will be counted as solved</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>You can skip problems and return to them later</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Wrong submissions don't incur penalties</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Once completed, you will receive your final score and analysis based on your performance.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 transition transform hover:scale-[1.02]">
          Start Mock Test
        </button>
      </div>
    </div>
  );
}

export default MockTestSetup;