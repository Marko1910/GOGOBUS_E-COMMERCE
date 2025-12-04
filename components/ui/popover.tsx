'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PopoverContextProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextProps | undefined>(undefined)

export function Popover({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const controlled = typeof open === 'boolean'
  const value = controlled ? open : internalOpen

  const setOpen = (next: boolean) => {
    if (!controlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return <PopoverContext.Provider value={{ open: value, setOpen }}>{children}</PopoverContext.Provider>
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    return (
      <button
        ref={ref}
        type="button"
        className={cn('inline-flex items-center', className)}
        onClick={(e) => {
          ctx?.setOpen(!ctx.open)
          props.onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
PopoverTrigger.displayName = 'PopoverTrigger'

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx?.open) return null
    return (
      <div
        ref={ref}
        className={cn(
          'z-50 mt-2 w-64 rounded-md border bg-white shadow-lg outline-none animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PopoverContent.displayName = 'PopoverContent'
