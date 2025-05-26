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
        <div>
            <Navbar />
            <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-lg text-gray-700">This section will display your analytics data.</p>
            {/* Add charts, graphs, or other analytics components here */}
            {data && <UserPieChart data = {data} />}
            {data && <UserBarLabel data = {data} />}
            {data && <UserBarRatings data = {data} />}
        </div>
    )
}

export default Analytics;