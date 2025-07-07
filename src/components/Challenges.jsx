import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

function Challenges() {

    const navigate = useNavigate();

    const [DailyProblem, setDailyProblem] = useState("");
    const [DailyProblemRating, setDailyProblemRating] = useState(0);
    const [ContestID, setContestID] = useState(0);
    const [index, setIndex] = useState("");
    const [tags, setTags] = useState([]);
    const [favAdded, setFavAdded] = useState(false);
    const [favourites, setFavourites] = useState([]);
    const [handle, setHandle] = useState("");
    const [dailySolved, setdailySolved] = useState(false);

    useEffect(() => {
        const fetchRandomProblem = async () => {
          let result = await fetch("http://localhost:5000/daily-question", {
            method: "get",
            credentials: "include",
          });
          result = await result.json();
            if (!result.success) {
                console.error("Failed to fetch daily problem:", result.message);
            }
          setDailyProblem(result.question.problem.name);
          setDailyProblemRating(result.question.problem.rating);
          setContestID(result.question.problem.contestId);
          setIndex(result.question.problem.index);
          setTags(result.question.problem.tags);

          fetchFavourites(result.question.problem.contestId, result.question.problem.index);

        };  
        fetchRandomProblem();
      }, []);

      useEffect(() => {

        if(!ContestID || !index) 
        {
            return;
        }
        handleAccepted();

      }, [ContestID, index]);


      const fetchFavourites = async (contestId, problemIndex) => {
        try {
            const response = await fetch("http://localhost:5000/get-favourite-questions", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (response.status === 404) {
                // No favorites found
                setFavourites([]);
                setFavAdded(false);
                return;
            }
            
            if (response.status !== 200) {
                throw new Error("Failed to fetch favourites");
            }
            
            const data = await response.json();
            
            if (data && data.favouriteQuestions) {
                setFavourites(data.favouriteQuestions);
                
                // Check if daily problem is in favorites
                const isDailyProblemFavorite = data.favouriteQuestions.some(fav => 
                    fav.contestId == contestId && 
                    fav.index == problemIndex
                );
                
                setFavAdded(isDailyProblemFavorite);
            }
        } catch (error) {
            console.error("Error fetching favourites:", error);
        }
    };

    // Function to toggle favorite status
    const toggleFavorite = async () => {
        if (!ContestID || !index) return;
        
        try {
            if (favAdded) {
                // Remove from favorites
                const response = await fetch("http://localhost:5000/remove-favourite-question", {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contestId: ContestID,
                        index: index,
                    }),
                });
                if (response.status === 200) {
                    setFavAdded(false);
                }
            } else {
                // Add to favorites
                const response = await fetch("http://localhost:5000/add-favourite-question", {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contestId: ContestID,
                        index: index,
                        question: {
                            contestId: ContestID,
                            index: index,
                            title: DailyProblem,
                            difficulty: DailyProblemRating,
                            tags: tags 
                        }
                    }),
                });
                
                if (response.status === 200) {
                    setFavAdded(true);
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };


      const handleDailyChallenge = async () => {
        const url = `https://codeforces.com/contest/${ContestID}/problem/${index}`;
        window.open(url, "_blank").focus();
      };

      const handleAccepted = async () => {
        const fetchHandle = async () => {
            try {
                // setLoading(true);
                const response = await fetch("http://localhost:5000/get-codeforces-handle", {
                    method: "get",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (response.status !== 200) {
                    throw new Error("Failed to fetch codeforces handle");
                }
                
                const userData = await response.json();
  
                if (!userData || !userData.codeforcesHandle) {
                    console.log("handle not received.");
                    return;
                }
                
                // Now fetch test history with userId
                if (userData.codeforcesHandle) {
                    setHandle(userData.codeforcesHandle);
                    await fetchIsDailySolved(userData.codeforcesHandle);
                }
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };
        
        fetchHandle();
      };

      const fetchIsDailySolved = async (handle) => {
        try {
            const response = await fetch("http://localhost:5000/isDailySolved", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    handle: handle,
                    contestId: ContestID,
                    index: index,
                }),
            });
            
            if (response.status !== 200) {
                throw new Error("Failed to fetch daily solved status");
            }
            
            const data = await response.json();
            
            if (data && data.dailySolved !== undefined) {
                if(data.dailySolved) {
                    setdailySolved(true);
                    const response = await fetch("http://localhost:5000/update-user-stats", {
                        method: "post",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contestId: ContestID,
                            index: index,
                        }),
                    });
                    
                    
                    if (response.status !== 200) {
                        throw new Error("Failed to update solved problems");
                    }   
                    
                }
                else{
                    setdailySolved(false);
                }
            }
            else {
                console.log("error fetching dailyProblem details.");
            }
        } catch (error) {
            console.error("Error fetching dailyProblem status:", error);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-10">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Coding Challenges</h1>
                <p className="text-xl text-gray-600">Sharpen your skills with daily practice and speed challenges</p>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Daily Challenge Card */}
                <div
                    className={`rounded-xl shadow-lg overflow-hidden border transition-shadow duration-300 ${
                        dailySolved
                            ? "bg-green-100 border-green-500 hover:shadow-lg"
                            : "bg-white border-blue-100 hover:shadow-xl"
                    }`}
                >
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="ro und" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Daily Challenge</h2>
                            
                            {/* Toggle favorite button */}
                            <button 
                                onClick={toggleFavorite} 
                                className="ml-auto flex items-center justify-center hover:cursor-pointer"
                            >
                                {favAdded ? (
                                    <FaStar size={26} className="text-yellow-500" />
                                ) : (
                                    <FaRegStar size={26} className="text-gray-400 hover:text-yellow-500" />
                                )}
                            </button>

                        </div>
                        <p className="text-gray-600 mb-6">
                            A new problem every day to keep your skills sharp. Solve today's challenge to maintain your streak!
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-blue-800 mb-2">Today's Challenge:</h3>
                            <p className="text-gray-700">{DailyProblem} (Rating: {DailyProblemRating})</p>
                        </div>
                        <button onClick = {handleDailyChallenge}  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer">
                            Start Today's Challenge
                        </button>
                        
                    </div>
                </div>

                {/* Speed Code Mode Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Speed Code Mode</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Race against the clock! Solve problems under tight time constraints (15-30 minutes) to improve your coding speed.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-purple-800 mb-2">Current Options:</h3>
                            <ul className="space-y-1 text-gray-700">
                                <li>• Easy (15 minutes)</li>
                                <li>• Medium (25 minutes)</li>
                                <li>• Hard (30 minutes)</li>
                            </ul>
                        </div>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer">
                            Start Speed Challenge
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-7">About Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-blue-600 mb-2">Daily Challenge</h4>
                        <p className="text-gray-600">
                            Each day we feature a new problem carefully selected to help you gradually improve your problem-solving skills. 
                            Maintain your streak by solving daily challenges consecutively!
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-purple-600 mb-2">Speed Code Mode</h4>
                        <p className="text-gray-600">
                            Simulate competition conditions with timed challenges. This mode helps you improve your coding speed, 
                            quick thinking, and ability form under pressure - essential skills for coding interviews and contests.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Challenges;