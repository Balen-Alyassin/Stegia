import { ResponsiveLine } from "@nivo/line";
import { useTheme, Box, Button, Stack, FormControlLabel, Checkbox } from "@mui/material"; 
import { tokens } from "../theme";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
//import { mockLineData as data } from "../data/mockdata";
//import { mockDataReports as data } from "../data/mock_data";
import { exportAsImage, exportAsPDF, printChart } from '../scenes/line/exports';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const LineChart = ( isDashboard = false) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
   

     // Keys for which you want to display data and checkboxes
     const currentKeys = [
        "idle_current_24v", "idle_current_3v", "solenoid1_current", "solenoid2_current",
        "solenoid3_current", "solenoid4_current", "solenoid5_current", "solenoid6_current",
        "solenoid7_current", "solenoid8_current"
    ];

    // Initially select all currentKeys
    const [selectedKeys, setSelectedKeys] = useState([...currentKeys]);


        const currentColors = {
        "idle_current_24v": tokens("dark").greenAccent[500],
        "idle_current_3v": tokens("dark").blueAccent[500],
        "solenoid1_current": tokens("dark").redAccent[200],
        "solenoid2_current": tokens("dark").blueAccent[300],
        "solenoid3_current": tokens("dark").redAccent[400],
        "solenoid4_current": tokens("dark").blueAccent[500],
        "solenoid5_current": tokens("dark").grey[400],
        "solenoid6_current": tokens("dark").redAccent[300],
        "solenoid7_current": tokens("dark").greenAccent[400],
        "solenoid8_current": tokens("dark").primary[400]
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => {
                setData(response.data);
                console.log('Data fetched successfully:', response.data);
            })
            .catch(error => console.error('Failed to fetch data:', error));
    }, []);
    

    

    const handleDateChange = (type, value) => {
        if (type === 'from') {
            setDateFrom(value);
        } else {
            setDateTo(value);
        }
    };

    const toggleKeySelection = key => {
        setSelectedKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const transformedData = selectedKeys.map(key => ({
        id: key,
        color: currentColors[key], // Ensure each key has a unique color
        data: data.filter(entry => {
            const entryDate = new Date(entry.date_added);
            return (!dateFrom || entryDate >= dateFrom) && (!dateTo || entryDate <= dateTo);
        }).map(entry => ({
            x: new Date(entry.date_added).toISOString().split('T')[0], // Format the date for better axis formatting
            y: entry[key] || 0 // Handle undefined cases
        }))
    }));
    


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box m={2} ref={chartRef} style={{ height: "800px" }}>
                {/* Date range selection */}
                <DatePicker label="From" value={dateFrom} onChange={(value) => handleDateChange('from', value)} />
                <DatePicker label="To" value={dateTo} onChange={(value) => handleDateChange('to', value)} />


                {/* Checkbox filters for selecting keys, with labels on top */}
                <Stack direction="row" spacing={1} sx={{ '& .MuiFormControlLabel-root': { alignItems: 'start' }}}>
                    {currentKeys.map(key => (
                        <FormControlLabel
                            key={key}
                            control={<Checkbox
                                checked={selectedKeys.includes(key)}
                                onChange={() => toggleKeySelection(key)}
                            />}
                            label={key}
                            labelPlacement="top"
                            sx={{ '.MuiCheckbox-root': { paddingTop: 0 }, margin: 0 }}
                        />
                    ))}
                </Stack>

        {/* Button area */}
        <Box mt={2} mb={2} display="flex" justifyContent="right">
            <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary" onClick={() => exportAsImage(chartRef.current, 'jpeg')}>
                Export as JPEG
            </Button>
            <Button variant="contained" color="secondary" onClick={() => exportAsPDF(chartRef.current)}>
                Export as PDF
            </Button>
            <Button variant="contained" color="secondary" onClick={printChart}>
                Print Chart
            </Button>
            </Stack>
        </Box>

        {/* Nivo Line Chart */}
        <ResponsiveLine
        data={transformedData}
        colors={{ datum: 'color' }}
        theme={{
            axis: {
                domain: {
                    line: {
                        stroke: colors.grey[100]
                    },
                },
                legend: {
                    text: {
                        fill: colors.grey[100]
                    }
                },
                ticks: {
                    line: {
                        stroke: colors.grey[100],
                        strokeWidth: 1
                    },
                    text: {
                        fill: colors.grey[100]
                    },
                },
            },
            legends: {
                text: {
                    fill: colors.grey[100]
                },
            },
            tooltip: {
                container: {
                    color: colors.primary[500],
                },
            },
        }}
       // colors={isDashboard ? {datum: "color"} : {scheme: "nivo"}} //use own color
        margin={{ top: 50, right: 110, bottom: 100, left: 70 }}
        xScale={{ type: 'point',  }}
        yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: false,
            reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        //curve="linear"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
           // legend: isDashboard ? undefined : "transportation",
            legend: "Number of Tests",
            legendOffset: 80,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        axisLeft={{
            orient: "left",
            tickValues: 20,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
           // legend: isDashboard ? undefined : "count",
            legend: "Current [ma]",
            legendOffset: -50,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        //enableGridX={false}
        //enableGridY={false}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
    </Box>
    </LocalizationProvider>
)
}

export default LineChart;