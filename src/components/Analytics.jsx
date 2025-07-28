import { useState, useEffect } from "react";
import UserPieChart from "./UserPieChart";
import UserBarLabel from "./UserBarLabel";
import UserBarRatings from "./UserBarRatings";
import Navbar from "./Navbar";

function Analytics() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            // Fetch user data first
            const fetchUserData = async () => {
                try {
                    const response = await fetch("http://localhost:5000/user-data", {
                        method: "get",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    
                    if (response.status !== 200) {
                        throw new Error("Failed to fetch user data");
                    }
                    
                    const userData = await response.json();
                    
                    // Now fetch test history with userId
                    if (userData.userId) {
                        await fetchUserStats(userData.userId);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            
            fetchUserData();
        }, []);

        const fetchUserStats = async (id) => {
            try {
                const response = await fetch(`http://localhost:5000/get-user-stats/${id}`, {
                    method: "get",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                
                if(response.status === 200) {
                    console.log(data);
                    setData(data);
                    setLoading(false);
                }
                else {
                    setError(data.message || "Failed to fetch user stats");
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (loading) {
            return (
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-6xl mx-auto mt-16 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your Analytics...</p>
                    </div>
                </div>
            );
        }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto mt-16 text-center">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p>Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center">
                This section displays your analytics data.
            </p>

            {/* Stacked Layout for Analytics Components */}
            <div className="space-y-8">
                {data && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pie Chart</h2>
                        <UserPieChart data={data} />
                    </div>
                )}
                {data && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bar Chart (Labels)</h2>
                        <UserBarLabel data={data} />
                    </div>
                )}
                {data && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bar Chart (Ratings)</h2>
                        <UserBarRatings data={data} />
                    </div>
                )}
            </div>
        </div>
    </div>
);
}

export default Analytics;