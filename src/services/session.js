const SESSION_KEY = 'mi-clase-session'

export function getSession() {
  const savedSession = localStorage.getItem(SESSION_KEY)
  return savedSession ? JSON.parse(savedSession) : null
}

export function saveSession(session) {
  if (!session?.token || !session?.user?.id) {
    throw new Error('La respuesta de autenticación no contiene un token y usuario válidos.')
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
