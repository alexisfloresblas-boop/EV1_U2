import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPost } from '../services/api.js'
import { getSession } from '../services/session.js'

function CrearPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const session = getSession()

  async function handleSubmit(event) {
    event.preventDefault()

    if (!session?.token) {
      setStatus('error')
      setMessage('Inicia sesión para crear una publicación.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      await createPost({ title: title.trim(), content: content.trim() }, session.token)
      navigate('/posts', { replace: true, state: { created: true } })
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold text-blue-700">Crear publicación</h1>
      <p className="mt-2 text-gray-600">Completa el título y el contenido de tu publicación.</p>

      {!session?.token && (
        <p className="mt-4 rounded bg-amber-100 p-3 text-sm text-amber-900">
          Debes <Link to="/login" className="font-semibold underline">iniciar sesión</Link> para publicar.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-medium text-gray-800">
          Título
          <input
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            required
          />
        </label>

        <label className="block text-sm font-medium text-gray-800">
          Contenido
          <textarea
            className="mt-1 block min-h-36 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
            required
          />
        </label>

        {message && <p className="rounded bg-red-100 p-3 text-sm text-red-800" role="alert">{message}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === 'submitting' || !session?.token}
            className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Publicando...' : 'Publicar'}
          </button>
          <Link to="/posts" className="rounded border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default CrearPost
