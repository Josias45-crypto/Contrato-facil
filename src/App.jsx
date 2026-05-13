import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Generador from './pages/Generador'
import AdminJoel from './pages/AdminJoel'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generar" element={<Generador />} />
        <Route path="/admin-joel" element={<AdminJoel />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
