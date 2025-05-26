import { ResponsiveBar } from '@nivo/bar'


export default function UserBarRatings({data}) {
    const formatRatingsData = () => {
        if (!data?.userStats?.difficultyStats) {
            return [];
        }
        
        // Convert to array format for the bar chart
        // Format: [{ index: "A", count: 3 }, { index: "B", count: 5 }, ...]
        return Object.entries(data.userStats.difficultyStats).map(([rating, count]) => ({
            rating,
            count
        }));
    };

    const ratingsData = formatRatingsData();
    
    const MyBar = ({ data }) => (
        <ResponsiveBar
            data={data}
            keys={['count']}
            indexBy="rating"
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={{ scheme: 'nivo' }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Problem Rating',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Number of Problems Solved',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
    
    return(
        <div className='h-[400px] w-full'>
            <h2 className="text-xl font-semibold mb-2">Problems Solved by Index</h2>
            {ratingsData.length > 0 ? (
                <div className="h-[350px]">
                    <MyBar data={ratingsData} />
                </div>
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No problem index data available</p>
                </div>
            )}
        </div>
    )
}