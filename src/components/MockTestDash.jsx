import { React, useState } from "react";

function MockTestDashboard() {
  const [completedTests, setCompletedTests] = useState([
    {
      id: 1,
      title: "Thor the Fisherman",
      accepted: false,
      questionLink: "/questions/thor-fisherman"
    },
    {
      id: 2,
      title: "Purification of the Source Scroll",
      accepted: false,
      questionLink: "/questions/purification-scroll"
    },
    {
      id: 3,
      title: "Thor the Thinker and Gamer",
      accepted: false   ,
      questionLink: "/questions/thor-thinker-gamer"
    },
    {
      id: 4,
      title: "Temple Traversal",
      accepted: false,
      questionLink: "/questions/temple-traversal"
    }
  ]);

  const markAsAccepted = (id) => {
    setCompletedTests(prev => 
      prev.map(test => 
        test.id === id ? {...test, accepted: true} : test
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mock Test Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your completed challenges</p>
        </div>

        {/* Challenges Section */}
        <div className="space-y-4">
          {completedTests.map((test) => (
            <div 
              key={test.id} 
              className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
                test.accepted 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-medium ${
                    test.accepted ? 'text-gray-600' : 'text-gray-800'
                  }`}>
                    {test.title}
                  </h3>
                  <p className={`text-sm ${
                    test.accepted ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {test.accepted ? 'Completed' : 'Pending'}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {!test.accepted && (
                    <button 
                      onClick={() => markAsAccepted(test.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark Accepted
                    </button>
                  )}
                  <a 
                    href={test.questionLink}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Question
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MockTestDashboard;