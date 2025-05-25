import { ResponsiveBar } from '@nivo/bar'
import {useEffect, useState} from 'react'


export default function UserBarLabel() {

    const data = [
    {
        "country": "AD",
        "hot dog": 188,
        "burger": 183,
        "sandwich": 169,
        "kebab": 113,
        "fries": 195,
        "donut": 195
    },
    {
        "country": "AE",
        "hot dog": 90,
        "burger": 67,
        "sandwich": 46,
        "kebab": 200,
        "fries": 12,
        "donut": 149
    },
    {
        "country": "AF",
        "hot dog": 151,
        "burger": 97,
        "sandwich": 184,
        "kebab": 26,
        "fries": 186,
        "donut": 112
    },
    {
        "country": "AG",
        "hot dog": 87,
        "burger": 9,
        "sandwich": 160,
        "kebab": 116,
        "fries": 32,
        "donut": 39
    },
    {
        "country": "AI",
        "hot dog": 100,
        "burger": 200,
        "sandwich": 24,
        "kebab": 31,
        "fries": 187,
        "donut": 67
    },
    {
        "country": "AL",
        "hot dog": 97,
        "burger": 155,
        "sandwich": 87,
        "kebab": 161,
        "fries": 109,
        "donut": 132
    },
    {
        "country": "AM",
        "hot dog": 145,
        "burger": 73,
        "sandwich": 108,
        "kebab": 97,
        "fries": 116,
        "donut": 51
    }
    ]

    const MyBar = ({ data /* see data tab */ }) => (
        <ResponsiveBar /* or Bar for fixed dimensions */
            data={data}
            keys={['hot dog']}
            indexBy="country"
            groupMode="grouped"
            labelSkipWidth={12}
            labelSkipHeight={12}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 120,
                    itemsSpacing: 3,
                    itemWidth: 100,
                    itemHeight: 16
                }
            ]}
            axisBottom={{ legend: 'country (indexBy)', legendOffset: 32 }}
            axisLeft={{ legend: 'food', legendOffset: -40 }}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        />
    )
    
    return(
        <div className='min-h-[500px] relative'>
            <h2 className="text-2xl font-bold mb-4">User Bar Chart</h2>
            <MyBar data={data} />
        </div>
    )
}