import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import { ThemeProvider } from './context/ThemePrivider';
import Master from "./router/Master";
import AuthPage from "./auth/AuthPage";
import NotificationContainer from "./components/NotificationContainer";

function App() {

  return (
   <ThemeProvider defaultTheme="light">
 
     <Router>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/*" element={<Master />} />
          </Routes>
          <NotificationContainer />
        </Router>

    </ThemeProvider>
  )
}

export default App
