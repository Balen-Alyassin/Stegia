import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Login from "./scenes/login/index";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Reports from "./scenes/reports";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";

function App() {
  const [theme, colorMode] = useMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);


  const handleLogin = (credentials) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
};


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            {isLoggedIn && <Sidebar />}
            <main className={isLoggedIn ? "content" : ""}>
              {isLoggedIn && <Topbar onLogout={handleLogout} />}
              <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                {isLoggedIn ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/line" element={<Line />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate replace to="/login" />} />
                )}
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
