import { Link } from 'react-router-dom'

function Inicio() {
  return (
    <section className="rounded-lg bg-white p-6 shadow sm:p-8">
      <h1 className="text-3xl font-bold text-blue-700">Bienvenidos a nuestra clase</h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        Esta página es parte de la evaluación de Tecnologías Web. Aquí puedes
        revisar las publicaciones, conocer a tus compañeros y registrarte.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/posts"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Ver publicaciones
          </Link>
          <Link
            to="/mis-companeros"
            className="rounded border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50"
          >
            Ver mis compañeros
          </Link>
          <Link
            to="/registro"
            className="rounded border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50"
          >
            Registrarme
          </Link>
      </div>
    </section>
  )
}

export default Inicio
