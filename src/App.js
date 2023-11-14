import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseLine from '@mui/material/CssBaseline';
import { Routes, Route} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar  from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Reports from "./scenes/reports";
//import Maps  from "./scenes/maps";
//import Calendar from "./scenes/calendar";


function App() {
  const [theme, colorMode] = useMode();

  return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <div className="app"> 
      <Sidebar />
      <main ClassName="content">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<Team />}  />
          <Route path="/reports" element={<Reports />}  />
        </Routes>
        <Routes>
         
         
         
         {/* <Route path="/maps" element={<Maps />}  />*/}
         {/* <Route path="/calendar" element={<Calendar />}  />*/}
          
        </Routes>
      </main>
      </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
