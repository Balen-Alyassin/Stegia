import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonModeOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';

const Topbar = ({onLogout}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    // Handler for logout action
    const handleLogout = () => {
        // Assume `onLogout` is a prop function that clears the global login state
        onLogout();  // Clear the authentication state

        // Optionally, clear local storage if used
        localStorage.removeItem('userToken'); // Example: Clear user token
        localStorage.removeItem('user'); // Clear user data

        navigate('/login', { replace: true }); // Navigate to login page after logout
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* Search BAR */}
            <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
                <InputBase sx={{ ml: 2, flex: 1}} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex" sx={{ ml: 100, flex: 1}}>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <PersonModeOutlinedIcon />
                </IconButton>
                <IconButton onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;
