import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ApiError, getPosts, reactToPost } from '../services/api.js'
import { getSession } from '../services/session.js'

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Me divierte' },
  { type: 'wow', emoji: '😮', label: 'Me sorprende' },
  { type: 'sad', emoji: '😢', label: 'Me entristece' },
  { type: 'angry', emoji: '😡', label: 'Me enoja' },
]

function Publicaciones() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const location = useLocation()
  const session = getSession()
  const userName = session?.user?.name ?? 'Estudiante'
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  useEffect(() => {
    let active = true

    async function loadPosts() {
      setStatus('loading')
      setMessage(location.state?.created ? 'Publicación creada correctamente.' : '')

      try {
        const result = await getPosts()
        if (active) {
          setPosts(result)
          setStatus('success')
        }
      } catch (error) {
        if (active) {
          setMessage(error.message)
          setStatus('error')
        }
      }
    }

    loadPosts()
    return () => {
      active = false
    }
  }, [reloadKey, location.state])

  async function handleReaction(postId, type) {
    const session = getSession()
    setSending(`${postId}:${type}`)
    setMessage('')

    try {
      const result = await reactToPost(postId, type, session?.user?.id)
      if (!result?.counts || typeof result.counts !== 'object') {
        throw new Error('La respuesta de la API no contiene los contadores actualizados.')
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          (post.id ?? post._id) === postId
            ? { ...post, reactions: result.counts }
            : post,
        ),
      )
      setMessage('¡Reacción registrada!')
    } catch (error) {
      setMessage(
        error instanceof ApiError && error.status === 409
          ? 'Ya reaccionaste a esta publicación con ese tipo.'
          : error.message,
      )
    } finally {
      setSending(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-7 text-white shadow-lg shadow-blue-900/10 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
              COMUNIDAD DE AULA
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">El muro de Mi Clase</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Un lugar para compartir ideas, celebrar logros y estar más cerca como comunidad.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl" aria-hidden="true">💬</span>
            <div>
              <p className="text-2xl font-extrabold leading-none">{status === 'success' ? posts.length : '—'}</p>
              <p className="mt-1 text-xs font-medium text-blue-100">publicaciones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 font-bold text-blue-700 ring-2 ring-white">
                {initials || 'E'}
              </span>
              <Link
                to="/crear-post"
                className="group flex min-h-11 flex-1 items-center justify-between gap-3 rounded-full bg-slate-100 px-5 text-left text-slate-500 transition hover:bg-slate-50 hover:text-blue-700 hover:ring-1 hover:ring-blue-200"
              >
                <span>¿Qué quieres compartir, {userName}?</span>
                <span aria-hidden="true" className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600">✎</span>
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <Link
                to="/crear-post"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50 sm:flex-none sm:px-5"
              >
                <span aria-hidden="true" className="text-lg">✍️</span>
                Crear una publicación
              </Link>
              <span className="hidden px-2 text-xs text-slate-400 sm:inline">
                Tu voz también hace crecer la comunidad
              </span>
            </div>
          </div>

          {message && (
            <p
              className={`mt-4 rounded-xl border p-3 text-sm shadow-sm ${
                message.includes('correctamente') || message.includes('registrada')
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          {status === 'loading' && (
            <div className="mt-5 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" role="status">
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
            </div>
          )}

          {status === 'error' && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-white p-5 shadow-sm" role="alert">
              <p className="font-semibold text-red-700">No se pudieron cargar las publicaciones.</p>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Intentar nuevamente
              </button>
            </div>
          )}

          {status === 'success' && posts.length === 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="text-4xl" aria-hidden="true">💬</div>
              <h2 className="mt-3 font-bold text-slate-800">El muro está esperando su primera publicación</h2>
              <p className="mt-1 text-sm text-slate-500">Comparte una idea con tus compañeros.</p>
              <Link to="/crear-post" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
                Crear publicación
              </Link>
            </div>
          )}

          {status === 'success' && posts.length > 0 && (
            <div className="mt-5 grid gap-5">
              {posts.map((post, index) => {
                const postId = post.id ?? post._id
                const counts = post.reactions ?? {}
                const totalReactions = Object.values(counts).reduce(
                  (total, count) => total + (Number(count) || 0),
                  0,
                )
                const authorName = post.author?.name ?? 'Autor desconocido'
                const authorInitial = authorName.trim().charAt(0).toUpperCase() || '?'

                return (
                  <article
                    key={postId ?? index}
                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.06]"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md shadow-blue-700/20 ring-2 ring-white">
                          {authorInitial}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-slate-900">{authorName}</p>
                          <time className="text-xs text-slate-500" dateTime={post.createdAt}>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleString('es-CL', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'Fecha no disponible'}
                          </time>
                        </div>
                        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                          Mi Clase
                        </span>
                      </div>

                      <div className="mt-4">
                        <h2 className="text-xl font-bold leading-snug text-slate-900">{post.title}</h2>
                        <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed text-slate-700">{post.content}</p>
                      </div>
                    </div>

                    <div className="mx-4 flex items-center justify-between border-t border-slate-100 py-3 text-sm text-slate-500 sm:mx-5">
                      <span className="flex items-center gap-1.5">
                        {totalReactions > 0 && (
                          <span className="flex -space-x-1" aria-hidden="true">
                            {REACTIONS.filter(({ type }) => Number(counts[type]) > 0)
                              .slice(0, 3)
                              .map(({ type, emoji }) => (
                                <span key={type} className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm ring-1 ring-white">
                                  {emoji}
                                </span>
                              ))}
                          </span>
                        )}
                        <span className="ml-1">
                          {totalReactions} {totalReactions === 1 ? 'reacción' : 'reacciones'}
                        </span>
                      </span>
                      <span className="text-xs">{post.commentsCount ?? 0} comentarios</span>
                    </div>

                    <div className="mx-4 border-t border-slate-100 py-2 sm:mx-5">
                      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6" aria-label="Reacciones">
                        {REACTIONS.map(({ type, emoji, label }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleReaction(postId, type)}
                            disabled={!postId || sending !== null}
                            aria-label={`${label}: ${counts[type] ?? 0}`}
                            title={label}
                            className="flex min-w-0 items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-wait disabled:opacity-50"
                          >
                            <span aria-hidden="true" className="text-base">{emoji}</span>
                            <span>{counts[type] ?? 0}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Tu comunidad</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Un espacio para compartir ideas, celebrar logros y mantenernos conectados como clase.
              </p>
              <Link to="/mis-companeros" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">
                Conocer a mis compañeros
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
              <p className="font-semibold text-slate-700">Un buen espacio se construye entre todos</p>
              <p className="mt-2">Comparte con respeto y reacciona a las publicaciones de tu comunidad.</p>
            </div>
            <p className="px-2 text-xs text-slate-400">Mi Clase · Comunidad de aula</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Publicaciones
