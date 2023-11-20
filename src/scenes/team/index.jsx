import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockdata";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const SelectSmall = ({ row, onRoleChange }) => {
  const [role, setRole] = React.useState(row.roles);

  const handleChange = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    onRoleChange(row.id, newRole);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Role</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={role}
        label="Role"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="Citizen">Citizen</MenuItem>
        <MenuItem value="Authority">Authority</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
      </Select>
    </FormControl>
  );
};

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = React.useState(mockDataTeam);

  const handleRoleChange = (id, newRole) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, roles: newRole, access: newRole } : row
      )
    );
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    /*{
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    }, */
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.8,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1.3,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "Authority" && <AdminPanelSettingsOutlinedIcon />}
            {access === "Admin" && <SecurityOutlinedIcon />}
            {access === "Citizen" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "4px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "roles",
      headerName: "Change Roles",
      flex: 1.5,
      renderCell: ({ row }) => <SelectSmall row={row} onRoleChange={handleRoleChange} />,
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
        }}
      >
        <DataGrid rows={data} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
