import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

function MockTestSetup() {

  const navigate = useNavigate();
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({
    lowerBound: '',
    upperBound: '',
    timeLimit: ''
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const validateDifficulty = (value, isLowerBound) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || value === '') return false;
    
    // Check if value is in valid range (800-2200) and multiple of 100
    if (numValue < 800 || numValue > 2200 || numValue % 100 !== 0) {
      return false;
    }
    
    // Cross-bound validation
    if (isLowerBound && upperBound && numValue > parseInt(upperBound)) {
      return false;
    }
    if (!isLowerBound && lowerBound && numValue < parseInt(lowerBound)) {
      return false;
    }
    
    return true;
  };

  const validateTime = (value) => {
    const numValue = parseInt(value);
    return !isNaN(numValue) && numValue > 0 && numValue % 10 === 0 && value !== '';
  };

  const handleLowerBoundChange = (e) => {
    const value = e.target.value;
    setLowerBound(value);
    
    const isValid = validateDifficulty(value, true);
    setErrors(prev => ({
      ...prev,
      lowerBound: isValid ? '' : 'Must be between 800-2200 in 100 increments and ≤ upper bound'
    }));
  };

  const handleUpperBoundChange = (e) => {
    const value = e.target.value;
    setUpperBound(value);
    
    const isValid = validateDifficulty(value, false);
    setErrors(prev => ({
      ...prev,
      upperBound: isValid ? '' : 'Must be between 800-2200 in 100 increments and ≥ lower bound'
    }));
  };

  const handleTimeLimitChange = (e) => {
    const value = e.target.value;
    setTimeLimit(value);
    
    const isValid = validateTime(value);
    setErrors(prev => ({
      ...prev,
      timeLimit: isValid ? '' : 'Must be a positive multiple of 10 (e.g., 10, 20, 30)'
    }));
  };

  const isFormValid = () => {
    return (
      validateDifficulty(lowerBound, true) &&
      validateDifficulty(upperBound, false) &&
      validateTime(timeLimit) &&
      selectedTags.length > 0
    );
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Start Mock Test</h1>
        <p className="text-gray-500">Set your preferences and review the rules</p>
      </div>

      {/* Test Configuration */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Test Preferences</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Difficulty Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Range</label>
            <div className="flex gap-3">
              <div className="w-full">
                <input
                  type="number"
                  placeholder="e.g. 800"
                  value={lowerBound}
                  onChange={handleLowerBoundChange}
                  className={`w-full px-4 py-2 border ${
                    errors.lowerBound ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                  min="800"
                  max="2200"
                  step="100"
                />
                {errors.lowerBound && (
                  <p className="mt-1 text-sm text-red-600">{errors.lowerBound}</p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={upperBound}
                  onChange={handleUpperBoundChange}
                  className={`w-full px-4 py-2 border ${
                    errors.upperBound ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                  min="800"
                  max="2200"
                  step="100"
                />
                {errors.upperBound && (
                  <p className="mt-1 text-sm text-red-600">{errors.upperBound}</p>
                )}
              </div>
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={timeLimit}
              onChange={handleTimeLimitChange}
              className={`w-full px-4 py-2 border ${
                errors.timeLimit ? 'border-red-500' : 'border-gray-200'
              } rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
              min="10"
              step="10"
            />
            {errors.timeLimit && (
              <p className="mt-1 text-sm text-red-600">{errors.timeLimit}</p>
            )}
          </div>
        </div>

        {/* Tags Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Problem Tags</label>
          <div className="flex flex-wrap gap-2">
            {["binary search", "bitmasks", "brute force", "combinatorics", "constructive algorithms", "data structures", "dfs and similar", "divide and conquer", "dp", "dsu", "games", "geometry", "graphs", "greedy", "math", "number theory", "probabilities", "shortest paths", "sortings", "strings", "ternary search", "trees", "two pointers"]
              .map(tag => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm transition-colors hover:cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-green-300 text-gray-800 hover:bg-green-400'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            <button
              className={`px-3 py-1 rounded-full text-sm transition-colors hover:cursor-pointer ${
                selectedTags.includes('Mixed')
                  ? 'bg-green-300 text-gray-800 hover:bg-green-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => toggleTag('Mixed')}
            >
              Mixed
            </button>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Test Rules</h2>
        <div className="max-h-48 overflow-y-auto pr-3">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>4 problems will be selected based on your configuration</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Timer starts immediately and cannot be paused</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>The mock assessment session will end when you have successfully submitted a correct answer for each question, the allotted time has expired, or you end the session manually.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You can use a local IDE, but AI-generated solutions or predefined templates are not allowed.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>It's recommended to use online IDEs like CodeChef IDE for a seamless experience.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Only accepted submissions will be counted as solved</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You can skip problems and return to them later</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Wrong submissions don't incur penalties</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>After getting correct answer, click on accepted button on the dashboard</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button 
          className={`px-8 py-3 font-medium rounded-lg shadow-sm transition-colors hover:shadow-md ${
            isFormValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isFormValid()}
          onClick = {() => navigate('/mock-test-dashboard')}
        >
          Start Mock Test
        </button>
      </div>
    </div>
  );
}

export default MockTestSetup;