import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../services/api.js'
import { saveSession } from '../services/session.js'

const RUT_PATTERN = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/

const initialForm = {
  name: '',
  lastName: '',
  rut: '',
  email: '',
  password: '',
}

function Registro() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setStatus('idle')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!RUT_PATTERN.test(form.rut)) {
      setStatus('error')
      setMessage('Ingresa el RUT con puntos y guion, por ejemplo: 12.345.678-9.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const session = await registerUser(form)
      saveSession(session)
      setStatus('success')
      setMessage('¡Registro completado! Ya iniciaste sesión y puedes publicar.')
      setForm(initialForm)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  const inputClassName =
    'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none'

  return (
    <section className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow sm:p-8">
      <h1 className="text-3xl font-bold text-blue-700">Formulario de Registro</h1>
      <p className="mt-2 text-gray-700">Completa tus datos para registrarte.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Nombre
            <input
              className={inputClassName}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="given-name"
              placeholder="Tu nombre"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Apellido
            <input
              className={inputClassName}
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              placeholder="Tu apellido"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            RUT
            <input
              className={inputClassName}
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              autoComplete="off"
              placeholder="12.345.678-9"
              pattern="\d{1,2}\.\d{3}\.\d{3}-[\dkK]"
              title="Usa el formato 12.345.678-9"
              required
            />
            <span className="mt-1 block text-xs font-normal text-gray-500">Escríbelo con puntos y guion.</span>
          </label>

          <label className="block text-sm font-medium">
            Correo electrónico
            <input
              className={inputClassName}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="nombre@correo.cl"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Contraseña
            <input
              className={inputClassName}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Crea una contraseña"
              required
            />
          </label>

        {message && (
          <p
            className={`mt-4 rounded p-3 text-sm ${
              status === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'submitting' ? 'Enviando...' : 'Registrarme'}
        </button>
      </form>

      <Link to="/login" className="mt-4 inline-block text-sm text-blue-700 underline">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </section>
  )
}

export default Registro
