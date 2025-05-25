import { useState, useEffect } from "react";
import UserPieChart from "./UserPieChart";
import UserBarLabel from "./UserBarLabel";
import Navbar from "./Navbar";

function Analytics() {
    return (
        <div>
            <Navbar />
            <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-lg text-gray-700">This section will display your analytics data.</p>
            {/* Add charts, graphs, or other analytics components here */}
            <UserPieChart />
            <UserBarLabel />
        </div>
    )
}

export default Analytics;