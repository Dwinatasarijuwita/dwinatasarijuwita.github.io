const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="/#home" className="font-semibold">Dwinatasari Juwita</a>
        <ul className="flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={`/${href}`} className="text-gray-600 hover:text-gray-900">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
