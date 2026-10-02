import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center dark:bg-neutral-900">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-neutral-100">404</h1>
      <p className="text-gray-600 dark:text-neutral-300">Page not found.</p>
      <Link to="/" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900">
        Back to desktop
      </Link>
    </main>
  )
}
