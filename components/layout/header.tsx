'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, Globe, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUser } from '@/hooks/use-user'
import { userService } from '@/services/user'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('ES')
  const { data: user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    userService.logout()
  }

  const handleLogin = () => {
    alert('Demo: la autenticación se habilitará en la fase de API real.')
  }

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 dark:bg-primary/95'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="bg-secondary p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M8 6v6" />
                <path d="M15 6v6" />
                <path d="M2 12h19.6" />
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
                <circle cx="7" cy="18" r="2" />
                <path d="M9 18h5" />
                <circle cx="16" cy="18" r="2" />
              </svg>
            </div>
            <span className={cn(
              "text-2xl font-bold tracking-tight",
              isScrolled ? "text-primary dark:text-white" : "text-white"
            )}>
              GOGO<span className="text-secondary">BUS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Inicio', href: '/' },
              { name: 'Mis Viajes', href: '/my-trips' },
              { name: 'Mi Perfil', href: '/profile' },
              { name: 'Ayuda', href: '/help' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary",
                  isScrolled ? "text-primary dark:text-white" : "text-white/90"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 cursor-pointer flex items-center"
              >
                {currentLanguage}
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-1 w-16 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleLanguageChange('ES')}
                    className="w-full px-3 py-1 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    ES
                  </button>
                  <button
                    onClick={() => handleLanguageChange('EN')}
                    className="w-full px-3 py-1 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    EN
                  </button>
                </div>
              )}
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full",
                      isScrolled ? "text-primary dark:text-white hover:bg-primary/10" : "text-white hover:bg-white/20"
                    )}
                  >
                    <User className="w-5 h-5" />
                    <span>{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-trips">Mis Viajes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild
                className={cn(
                  "font-semibold transition-all hover:scale-105",
                  isScrolled 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-white text-primary hover:bg-white/90"
                )}
                onClick={handleLogin}
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-md transition-colors z-50",
              isScrolled ? "text-primary dark:text-white" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Menu Overlay */}
          <div
            className={cn(
              "fixed inset-0 bg-primary/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
              isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}
          >
            <nav className="flex flex-col items-center gap-6 text-lg font-medium text-white">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
              <Link href="/my-trips" onClick={() => setIsMobileMenuOpen(false)}>Mis Viajes</Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
              <Link href="/help" onClick={() => setIsMobileMenuOpen(false)}>Ayuda</Link>
            </nav>

            <div className="flex flex-col gap-4 w-full max-w-xs px-6">
              {user ? (
                <>
                  <div className="text-white text-center mb-2">Hola, {user.firstName}</div>
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/profile">Mi Perfil</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90" onClick={() => {
                  handleLogin()
                  setIsMobileMenuOpen(false)
                }}>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  )
}
