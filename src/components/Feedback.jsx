import React from "react";

function Feedback() {
  return (
    <div className="max-w-md mx-auto my-8 p-4">
      <form className="flex flex-col gap-6 p-8 bg-gradient-to-br from-teal-50 to-teal-100 shadow-xl rounded-xl border border-teal-200">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-teal-800">Share Your Feedback</h2>
          <p className="text-teal-600 mt-1">We value your thoughts and suggestions</p>
        </div>

        {/* Feedback Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Feedback Type <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-700">
            <option value="" disabled selected>Select Feedback Type</option>
            <option value="ui">Website UI/UX</option>
            <option value="test">Mock Test Experience</option>
            <option value="questions">Question Quality</option>
            <option value="bug">Bug Report</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Your Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="5"
            placeholder="Please describe your feedback in detail..."
            className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-700"
          />
        </div>

        {/* Anonymous Submission */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-teal-700">
            Submit anonymously
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition duration-200 transform hover:scale-[1.02]"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default Feedback;