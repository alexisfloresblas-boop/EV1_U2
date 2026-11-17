import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api.js'
import { saveSession } from '../services/session.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const session = await login({ email, password })
      saveSession(session)
      navigate('/posts', { replace: true })
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold text-blue-700">Iniciar sesión</h1>
      <p className="mt-2 text-gray-600">Ingresa con tu cuenta de Mi Clase.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Correo electrónico
          <input
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Contraseña
          <input
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {message && <p className="rounded bg-red-100 p-3 text-sm text-red-800" role="alert">{message}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        ¿Aún no tienes cuenta? <Link to="/registro" className="text-blue-700 underline">Regístrate</Link>
      </p>
    </section>
  )
}

export default Login
