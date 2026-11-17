const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_URL en el archivo .env.')
  }

  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const responseText = await response.text()
  let data = null

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.error ?? data?.message ?? `La solicitud falló (${response.status}).`
    throw new ApiError(message, response.status)
  }

  return data
}

export async function getUsers() {
  const data = await request('users')
  const users = Array.isArray(data) ? data : data?.users

  if (!Array.isArray(users)) {
    throw new Error('La respuesta de la API no contiene una lista de usuarios válida.')
  }

  return users
}

export async function getPosts() {
  const data = await request('posts')
  const posts = Array.isArray(data) ? data : data?.posts

  if (!Array.isArray(posts)) {
    throw new Error('La respuesta de la API no contiene una lista de publicaciones válida.')
  }

  return posts
}

export async function createPost(post, token) {
  const data = await request('posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(post),
  })

  if (!data?.post) {
    throw new Error('La respuesta de la API no contiene la publicación creada.')
  }

  return data.post
}

export async function reactToPost(postId, type, userId) {
  const body = { type }
  if (userId) body.userId = userId

  return request(`posts/${encodeURIComponent(postId)}/reactions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function login(credentials) {
  return request('auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(user) {
  return request('auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}
