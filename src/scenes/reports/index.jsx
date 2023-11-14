import * as React from 'react';
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataReports } from "../../data/mockdata";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reportData, setReportData] = React.useState(mockDataReports);

  const handleReportAction = (id, action) => {
    const updatedReportData = reportData.map((report) => {
      if (report.id === id) {
        if (action === "delete") {
          report.status = "Deleted";
        } else if (action === "activateDisposal") {
          report.status = "Active for Disposal";
        }
      }
      return report;
    });
    setReportData(updatedReportData);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
    },
    {
      field: "litterType",
      headerName: "Type of Litter",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "userInfo",
      headerName: "User Info",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        const status = row.status || 'In Progress';
        return (
          <div>
            <select
              value={status}
              onChange={(e) => {
                handleReportAction(row.id, e.target.value);
              }}
            >
              <option value="In Progress">In Progress</option>
              <option value="delete">Delete</option>
              <option value="activateDisposal">Activate Disposal</option>
            </select>
          </div>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="REPORTS" subtitle="List of Reports" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& select": {
            width: "100%",
            padding: "5px",
          },
        }}
      >
        <div style={{ height: 760, width: '100%' }}>
          <DataGrid rows={reportData} columns={columns} 
          slots={{ Toolbar: GridToolbar }} />
        </div>
      </Box>
    </Box>
  );
};

export default Reports;
