import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Generador from './pages/Generador'
import AdminJoel from './pages/AdminJoel'

const IS_ADMIN = window.location.pathname === '/admin-joel'

export default function App() {
  const [page, setPage] = useState('home')
  const [tipoContrato, setTipoContrato] = useState(null)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (!IS_ADMIN) document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (IS_ADMIN) return <AdminJoel />

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const irAGenerador = (tipo) => {
    setTipoContrato(tipo)
    setPage('generador')
  }

  return (
    <div>
      {page === 'home' && (
        <Home onEmpezar={irAGenerador} theme={theme} toggleTheme={toggleTheme} />
      )}
      {page === 'generador' && (
        <Generador
          tipo={tipoContrato}
          onVolver={() => setPage('home')}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}
