import { ResponsivePie } from '@nivo/pie'


export default function UserPieChart({data}) {
    // Transform data for tags chart
    const formatTagsData = () => {
        if (!data || !data.userStats || !data.userStats.tagStats) {
            return [];
        }
        
        return Object.entries(data.userStats.tagStats).map(([tag, count]) => ({
            id: tag,
            label: tag,
            value: count,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        }));
    };

    const tagsData = formatTagsData();
    
    const MyPie = ({ data }) => (
        <ResponsivePie
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
    
    return (
        <div className="h-[400px] w-full">
            <h2 className="text-xl font-semibold mb-2">Problem Tags Distribution</h2>
            {tagsData.length > 0 ? (
                <MyPie data={tagsData} />
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No tag data available</p>
                </div>
            )}
        </div>
    )
}