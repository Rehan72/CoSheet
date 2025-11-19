import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import { ThemeProvider } from './context/ThemePrivider';
import Master from "./router/Master";

function App() {

  return (
   <ThemeProvider defaultTheme="light">
 
     <Router>
          <Routes>
            
            <Route path="/*" element={<Master />} />
          </Routes>
        </Router>

    </ThemeProvider>
  )
}

export default App
