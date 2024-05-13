import React, { useState, useEffect } from 'react';
import { Box, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
//import { mockDataReports as Data } from "../../data/mock_data";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";



const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

 // const [reportData, setReportData] = useState(Data); 
  const [reportData, setReportData] = useState([]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  // Filter data based on date range and checkboxes
  const filteredData = reportData.filter(entry => {
    const entryDate = new Date(entry.date_added);
    return (!dateFrom || entryDate >= dateFrom) && (!dateTo || entryDate <= dateTo);
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/data/${id}`, {
        status: newStatus
      });
      if (response.status === 200) {
        // Update local state to reflect the new status
        setReportData((prevData) =>
          prevData.map((data) =>
            data._id === id ? { ...data, status: newStatus } : data
          )
        );
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Error updating status.');
    }
  };
  

  const columns = [

    { field: "_id", headerName: "ID", flex: 1 },
    { field: "valve_module_part_number", headerName: "PartNumber", flex: 0.5 },
    { field: "valve_module_revision_number", headerName: "RevisionN", flex: 0.5 },
    { field: "pcb_article_number", headerName: "art.No", flex: 0.5 },
    { field: "pcb_revision", headerName: "Revision", flex: 0.5 },
    { field: "pcb_manufacturing_year", headerName: "Year", flex: 0.5 },
    { field: "pcb_manufacturing_week", headerName: "Week", flex: 0.5 },
    { field: "pcb_serial", headerName: "Serial", flex: 0.5 },
    { field: "idle_current_24v", headerName: "Idle-24V", flex: 0.5 },
    { field: "idle_current_3v", headerName: "Idle-3.3V", flex: 0.5 },
    { field: "solenoid1_current", headerName: "Sol 1", flex: 0.2 },
    { field: "solenoid2_current", headerName: "Sol 2", flex: 0.2 },
    { field: "solenoid3_current", headerName: "Sol 3", flex: 0.5 },
    { field: "solenoid4_current", headerName: "Sol 4", flex: 0.5 },
    { field: "solenoid5_current", headerName: "Sol 5", flex: 0.5 },
    { field: "solenoid6_current", headerName: "Sol 6", flex: 0.5 },
    { field: "solenoid7_current", headerName: "Sol 7", flex: 0.5 },
    { field: "solenoid8_current", headerName: "Sol 8", flex: 0.5 },
    { field: "test_person_id", headerName: "T.PersonID", flex: 0.5 },
    { field: "date_added", headerName: "Date", flex: 0.5 },
    { field: "time_added", headerName: "Time", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <strong style={{
            color: params.value === 'Passed' ? 'green' : params.value === 'Failed' ? 'red' : 'black',
          }}>
            {params.value}
          </strong>
        );
      },
    },
    { field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: ({ row }) => (
      <Box>
      <select
        value={row.status}
        onChange={(e) => handleStatusChange(row._id, e.target.value)}
      >
        <option value="In Progress">In Progress</option>
        <option value="Passed">Passed</option>
        <option value="Failed">Failed</option>
      </select>
    </Box>
    ),
  },
  ];
  

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div style={{ height: "800px"}}>
          <Box m="20px">
            <Header title="REPORTS" subtitle="List of Tests" />
            <Box display="flex" gap={2} mb={2}>
              <p> Date Search</p>
              <DatePicker
                label="From"
                value={dateFrom}
                onChange={setDateFrom}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="To"
                value={dateTo}
                onChange={setDateTo}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Box m="40px 0 0 0" height="75vh" width="165vh">
              <DataGrid
                rows={filteredData}
                columns={columns}
                getRowId={(row) => row._id}  // Use MongoDB's `_id`
                components={{ Toolbar: GridToolbar }}
                sx={{
                  "& .MuiDataGrid-root": { border: "none" },
                  "& .MuiDataGrid-cell": { borderBottom: "none" },
                  "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
                  "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                  "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
                  "& .MuiDataGrid-toolbarContainer": {backgroundColor: colors.blueAccent[700] },
                }}
              />
            </Box>
          </Box>
        </div>
      </LocalizationProvider>
    );
  };
  
  export default Reports;