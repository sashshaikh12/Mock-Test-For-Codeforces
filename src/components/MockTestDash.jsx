import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MockTestDashboard() {
  const location = useLocation();  
  const navigate = useNavigate();
  const { selectedTags, lowerBound, upperBound, timeLimit } = location.state || {};


  const [completedTests, setCompletedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have all the required parameters to start a test
        if (!selectedTags || !lowerBound || !upperBound) {
          // If we don't, try to fetch from an existing test
          const testStatusResponse = await fetch("http://localhost:5000/is-test-ongoing", { 
            method: "post",
            credentials: "include"
          });
          
          // If there's no ongoing test and no parameters, redirect to setup
          if (testStatusResponse.status !== 200) {
            alert("Failed to load test questions");
            navigate("/mock-test-setup");
            return;
          }
        }

        const userData = await fetch("http://localhost:5000/user-data", {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (userData.status !== 200) {
          console.log("Failed to fetch user data");
          navigate("/mock-test-setup");
          return;
        }
        const userDataJson = await userData.json();
    
        // If we have a userId, we can proceed to fetch test questions
        if (!userDataJson.userId) {
          console.log("User ID not found");
          navigate("/mock-test-setup");
          return;
        }
        // If we have all the required parameters, we can proceed to fetch test questions
        
        // Now fetch or create test questions
        let result = await fetch("http://localhost:5000/test-questions", {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            selectedTags, 
            lowerBound, 
            upperBound,
            timeLimit,
            userId: userDataJson.userId,
          }),
        });
        
        if (result.status !== 200) {
          throw new Error("Failed to fetch test questions");
        }
        
        const data = await result.json();
        
        if(data.message === "Not enough problems found") {
          alert("Not enough problems exist with the given inputs");
          navigate("/mock-test-setup");
          return;
        }

        let id = 0;
  
        const testsWithStatus = data.testQuestions.map(test => ({
          ...test,
          accepted: false,
          id: id++,
        }));
        
        setCompletedTests(testsWithStatus); 
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load test questions");
        navigate("/mock-test-setup");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompletedTests();
  }, [navigate, selectedTags, lowerBound, upperBound, timeLimit]);

  const markAsAccepted = (id) => {
    setCompletedTests(prev => 
      prev.map(test => 
        test.id === id ? {...test, accepted: true} : test
      )
    );
  };

  const handleEndTest = async () => {
    try {
      const response = await fetch('http://localhost:5000/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
  
      const { reportLink } = await response.json();
      console.log(reportLink);
      navigate(reportLink, {replace: true}); // Redirect to token-based URL
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mock Test Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your completed challenges</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            <p className="mt-4 text-gray-600">Fetching your test questions...</p>
          </div>
        )}

        {/* Challenges Section */}
        {!isLoading && (
          <div className="space-y-4">
            {completedTests.length > 0 ? (
              completedTests.map((test) => (
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
                        {test.name}
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
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors hover:cursor-pointer"
                        >
                          Mark Accepted
                        </button>
                      )}
                      <a 
                        href={`https://codeforces.com/contest/${test.contestId}/problem/${test.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Question
                      </a>
                    </div>
                  </div>
                </div>
              ))
              
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">No test questions available</p>
              </div>
            )}
            <div className="flex justify-center mt-6">
                    <button
                    onClick={handleEndTest}
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors hover:cursor-pointer"
                    >
                      End Test
                    </button>
                  </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default MockTestDashboard;