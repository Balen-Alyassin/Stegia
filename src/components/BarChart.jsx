import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Box, Stack, FormControlLabel, Checkbox, MenuItem, Select } from "@mui/material";
import { tokens } from "../theme";
import axios from 'axios';
import { ResponsiveBar } from "@nivo/bar";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
//import { exportAsImage, exportAsPDF, printChart } from '../scenes/bar/exports';
//import { mockDataReports as originalData } from "../data/mock_data1";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';



const BarChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [selectedTestPersons, setSelectedTestPersons] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => {
                setData(response.data);
                const uniqueTestPersons = [...new Set(response.data.map(item => item.test_person_id))];
                setSelectedTestPersons(uniqueTestPersons);
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

    const toggleTestPersonSelection = (personId) => {
        setSelectedTestPersons(prev =>
            prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
        );
    };

    const filteredData = data.filter(entry => {
        const entryDate = new Date(entry.date_added);
        return (!dateFrom || entryDate >= dateFrom) && (!dateTo || entryDate <= dateTo) && selectedTestPersons.includes(entry.test_person_id);
    });




    const exportAsJpg = () => {
        htmlToImage.toJpeg(chartRef.current, { quality: 0.95 })
            .then(function (dataUrl) {
                saveAs(dataUrl, 'chart.jpg');
            });
    };

    const exportAsCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + filteredData.map(entry => Object.values(entry).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "filtered_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    const printChart = () => {
        window.print();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box m={2} ref={chartRef} style={{ height: "800px" }}>
                <DatePicker label="From" value={dateFrom} onChange={(value) => handleDateChange('from', value)} />
                <DatePicker label="To" value={dateTo} onChange={(value) => handleDateChange('to', value)} />

                <Stack direction="row" spacing={1} sx={{ '& .MuiFormControlLabel-root': { alignItems: 'start' }}}>
                    {selectedTestPersons.map(personId => (
                        <FormControlLabel
                            key={personId}
                            control={<Checkbox
                                checked={selectedTestPersons.includes(personId)}
                                onChange={() => toggleTestPersonSelection(personId)}
                            />}
                            label={personId}
                            labelPlacement="top"
                        />
                    ))}
                </Stack>

                <Select defaultValue="" onChange={(e) => {
                    const selectedOption = e.target.value;
                    if (selectedOption === 'jpg') {
                        exportAsJpg();
                    } else if (selectedOption === 'csv') {
                        exportAsCsv();
                    } else if (selectedOption === 'print') {
                        printChart();
                    }
                }}>
                    <MenuItem value="" disabled>Export Option</MenuItem>
                    <MenuItem value="jpg">Export as JPG</MenuItem>
                    <MenuItem value="csv">Export as CSV</MenuItem>
                    <MenuItem value="print">Print</MenuItem>
                </Select>
            
            
            <ResponsiveBar
                
                data={filteredData}
                theme={{
                    axis: {
                        domain: {
                            line: {
                                stroke: colors.grey[100]
                            }
                        },
                        legend: {
                            text: {
                               fill: colors.grey[100] 
                            }
                        },
                        ticks: {
                            line: {
                                stroke: colors.grey[100]
                            }
                        },
                        text: {
                            fill: colors.grey[100]
                        },
                        legends: {
                            text: {
                                fill: colors.grey[100]
                            }
                        },
                    }
                }}
                keys={['idle_current_24v', 'idle_current_3v', 'solenoid1_current', 'solenoid2_current',
                'solenoid3_current', 'solenoid4_current', 'solenoid5_current', 'solenoid6_current',
                'solenoid7_current', 'solenoid8_current']}
                indexBy="test_person_id"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisBottom={{
                    tickSize: 3,
                    tickPadding: 5,
                    tickRotation: 25,
                    legend: 'Test Data by Person',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    truncateTickAt: 0,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Current Data',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    truncateTickAt: 0
                }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => `${e.id}: ${e.formattedValue} in Test Data by Person: ${e.indexValue}`}
            />
           
        </Box>
        </LocalizationProvider>
    );
};

export default BarChart;
