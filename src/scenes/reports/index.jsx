import * as React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataReports } from "../../data/mockdata";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reportData, setReportData] = React.useState(mockDataReports); // with fetch must be null
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = React.useState(false);

  const handleReportAction = (id, action) => {
    const updatedReportData = reportData.map((report) => {
      if (report.id === id) {
        if (action === "delete") {
          setDeleteModalOpen(true);
          setSelectedReport(report);
        } else if (action === "activateDisposal") {
          report.status = "Active for Disposal";
        } else if (action === "details") {
          setSelectedReport(report);
          setDetailsModalOpen(true);
        }
      }
      return report;
    });
    setReportData(updatedReportData);
  };

  const handleEditReport = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  
  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Perform delete action here
    const updatedReportData = reportData.filter((report) => report.id !== selectedReport.id);
    setReportData(updatedReportData);
    setDeleteModalOpen(false);
    setSelectedReport(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Report Details</title>
        </head>
        <body>
          <h1>Report Details</h1>
          <p>ID: ${selectedReport?.id}</p>
          <p>Title: ${selectedReport?.title}</p>
          <p>Date: ${selectedReport?.date}</p>
          <p>Description: ${selectedReport?.description}</p>
          ${selectedReport?.image && `<img src="${selectedReport?.image}" alt="Report Image" style="width: 100%; height: auto;" />`}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const detailsModalContent = (
    <div>
      {/* Inside Report Details Pop-up */}
      <p>Title: {selectedReport?.title}</p>
      <p>Description: {selectedReport?.description}</p>
      {selectedReport?.image && <img src={selectedReport?.image} alt="" style={{ width: '100%' , height: 'auto' }} />}
      {/* Add more details as needed (check with Saad) */}
    </div>
  );
  
  
  
  

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
      field: "categories",
      headerName: "Categories",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "reportBy",
      headerName: "Report By",
      flex: 1,
    },
    {
      field: "reportDetails", // Add the new field
      headerName: "Report Details",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button onClick={() => 
            handleReportAction(row.id, "details")} 
            color="secondary">Details
            </Button>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          {row.status || 'In Progress'}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <select
            value={row.status || 'Select'}
            onChange={(e) => handleReportAction(row.id, e.target.value)}
          >
            <option value="Select">Select</option>
            <option value="delete">Delete</option>
            <option value="activateDisposal">Activate Disposal</option>
          </select>
          <Button onClick={() => handleEditReport(row)}>Edit</Button>
        </Box>
      ),
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
          "& .custom-toolbar": {
            backgroundColor: colors.greenAccent[200], // Set the background color to white
          },
        }}
      >
        <div style={{ height: 750, width: '100%' }}>
          {/* Added a filter input */}
          <DataGrid
            rows={reportData}
            columns={columns}
            components={{
              Toolbar: () => (
                <div className='custom-toolbar'>
                  <GridToolbar />
                </div>
              ),
            }}
          />
        </div>
      </Box>

      {/* Edit Report Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={handleEditModalClose}>
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          {/* Include form fields for editing report details */}
          {/* For example: <TextField label="New Location" value={selectedReport.location} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button onClick={handleEditModalClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} 
        onClose={handleDeleteModalClose}
        sx={{ /* check with Saad if needed */ }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent 
          sx={{ backgroundColor: colors.neutral, color: colors.neutral }}
        >
           Are you sure you want to delete this report?
       </DialogContent>
       <DialogActions 
       sx={{ backgroundColor: colors.neutral }}
       >
      <Button onClick={handleDeleteModalClose} color="secondary">Cancel</Button>
      <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
    </DialogActions>
    </Dialog>

    {/* Report Details Modal Pop-up */}
    <Dialog 
      open={isDetailsModalOpen} 
      onClose={handleDetailsModalClose } 
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle color="secondary" fontSize={20}>Report Details</DialogTitle>
      <DialogContent >
        {detailsModalContent} 
      </DialogContent>
      <DialogActions>
        <Button 
        onClick={handlePrint} 
        color="secondary"
        >
          Print</Button>
        <Button 
        onClick={handleDetailsModalClose} 
        color="secondary"
        >
          Close</Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default Reports;
