import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import CrearPost from './pages/CrearPost.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import MisCompaneros from './pages/MisCompaneros.jsx'
import Publicaciones from './pages/Publicaciones.jsx'
import Registro from './pages/Registro.jsx'

function NavigationLink({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex min-w-0 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-700'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f0f2f5] text-slate-800">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <NavLink to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-lg text-white">M</span>
              <span>Mi Clase</span>
            </NavLink>

            <nav aria-label="Navegación principal" className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
              <NavigationLink to="/" end>Inicio</NavigationLink>
              <NavigationLink to="/posts">Publicaciones</NavigationLink>
              <NavigationLink to="/mis-companeros">Compañeros</NavigationLink>
              <NavigationLink to="/login">Ingresar</NavigationLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-132px)] max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/posts" element={<Publicaciones />} />
            <Route path="/publicaciones" element={<Navigate to="/posts" replace />} />
            <Route path="/crear-post" element={<CrearPost />} />
            <Route path="/mis-companeros" element={<MisCompaneros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registrarme" element={<Registro />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
          <div className="mx-auto max-w-7xl px-5">
            Proyecto de Tecnologías Web
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
