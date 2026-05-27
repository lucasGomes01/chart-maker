import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import Landing from './pages/Landing'
import Charts from './pages/Charts'
import NewChart from './pages/NewChart'
import ChartDetail from './pages/ChartDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/charts/new" element={<NewChart />} />
            <Route path="/charts/:id" element={<ChartDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}