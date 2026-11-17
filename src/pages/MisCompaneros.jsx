import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../services/api.js'

function MisCompaneros() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadUsers() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const result = await getUsers()
        if (active) {
          setUsers(result)
          setStatus('success')
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message)
          setStatus('error')
        }
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [reloadKey])

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Mis Compañeros</h1>
          <p className="mt-2 text-gray-700">Lista de compañeros registrados.</p>
        </div>
        <Link
          to="/registro"
          className="w-fit rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Registrarme
        </Link>
      </div>

      {status === 'loading' && (
        <div className="mt-6 rounded border border-gray-200 bg-white p-5" role="status">
          Cargando compañeros...
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 rounded border border-red-300 bg-white p-5" role="alert">
          <h2 className="font-bold text-red-700">No se pudo cargar la lista</h2>
          <p className="mt-2 text-sm text-gray-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {status === 'success' && users.length === 0 && (
        <div className="mt-6 rounded border border-gray-200 bg-white p-5">
          <h2 className="font-bold">Todavía no hay compañeros registrados</h2>
          <p className="mt-2 text-gray-600">Puedes ser la primera persona en unirte.</p>
          <Link to="/registro" className="mt-4 inline-block text-blue-700 underline">
            Ir al registro
          </Link>
        </div>
      )}

      {status === 'success' && users.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <article
              key={user.id ?? user.rut ?? user.email ?? `${user.name}-${index}`}
              className="rounded border border-gray-200 bg-white p-5"
            >
              <h2 className="font-bold">{user.name} {user.lastName}</h2>
              <p className="mt-2 text-sm text-gray-700"><strong>RUT:</strong> {user.rut}</p>
              <p className="mt-1 break-all text-sm text-gray-700"><strong>Email:</strong> {user.email}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisCompaneros
