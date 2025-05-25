import { ResponsivePie } from '@nivo/pie'
import { useEffect, useState } from 'react'


export default function UserPieChart() {

    const [tagsdata, setTagsData] = useState([]);
    

    // const data = [
    // {
    //     "id": "javascript",
    //     "label": "javascript",
    //     "value": 243,
    //     "color": "hsl(209, 70%, 50%)"
    // },
    // {
    //     "id": "make",
    //     "label": "make",
    //     "value": 232,
    //     "color": "hsl(148, 70%, 50%)"
    // },
    // {
    //     "id": "c",
    //     "label": "c",
    //     "value": 538,
    //     "color": "hsl(143, 70%, 50%)"
    // },
    // {
    //     "id": "stylus",
    //     "label": "stylus",
    //     "value": 568,
    //     "color": "hsl(309, 70%, 50%)"
    // },
    // {
    //     "id": "lisp",
    //     "label": "lisp",
    //     "value": 305,
    //     "color": "hsl(320, 70%, 50%)"
    // },
    // {
    //     "id": "sass",
    //     "label": "sass",
    //     "value": 451,
    //     "color": "hsl(300, 70%, 50%)"
    // }
    // , {
    //     "id": "a",
    //     "label": "a",
    //     "value": 568,
    //     "color": "hsl(309, 70%, 50%)"
    // }
    // , {
    //     "id": "b",
    //     "label": "b",
    //     "value": 305,
    //     "color": "hsl(320, 70%, 50%)"
    // }
    // , {
    //     "id": "c++",
    //     "label": "c++",
    //     "value": 451,
    //     "color": "hsl(300, 70%, 50%)"
    // }
    // , {
    //     "id": "d",
    //     "label": "d",
    //     "value": 568,
    //     "color": "hsl(309, 70%, 50%)"
    // }
    // , {
    //     "id": "e",
    //     "label": "e",
    //     "value": 305,
    //     "color": "hsl(320, 70%, 50%)"
    // }
    // ]

    const MyPie = ({ data /* see data tab */ }) => (
        <ResponsivePie /* or Pie for fixed dimensions */
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.6}
            cornerRadius={2}
            activeOuterRadiusOffset={8}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    symbolShape: 'circle'
                }
            ]}
        />
    )

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
                    
                    // Check if we have tag data
                    if (data.userStats && data.userStats.tagStats) {
                        // Convert the tagStats object to an array format the chart can use
                        const tagsArray = Object.entries(data.userStats.tagStats).map(([tag, count]) => ({
                            id: tag,
                            label: tag,
                            value: count,
                            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
                        }));
                        
                        console.log("Formatted tags data:", tagsArray);
                        
                        if (tagsArray.length > 0) {
                            setTagsData(tagsArray);
                        } else {
                            console.log("User has no tags data yet");
                        }
                    } else {
                        console.log("No tags data available in the response");
                    }
                } else if(response.status === 404) {
                    console.log("No data found for this user");
                } else {
                    throw new Error("Failed to fetch user stats");
                }
            } catch (err) {
                console.error(err);
            }
        };

    

    return (
        <div className="h-[400px] w-full">
            <MyPie data={tagsdata} />
        </div>
    )
}