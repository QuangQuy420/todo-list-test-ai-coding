'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Todos' },
    { href: '/analytics', label: 'Analytics' },
  ]

  return (
    <nav className="flex items-center gap-1" aria-label="Main navigation">
      {links.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? 'px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-accent-violet)] border-b-2 border-[var(--color-accent-violet)] transition-colors'
                : 'px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent'
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
