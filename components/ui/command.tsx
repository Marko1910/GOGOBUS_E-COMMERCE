'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full bg-white border rounded-md shadow-sm', className)} {...props} />
))
Command.displayName = 'Command'

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <div className="px-3 py-2 border-b">
    <input
      ref={ref}
      className={cn('w-full text-sm outline-none', className)}
      {...props}
      aria-label="Buscar"
      autoComplete="off"
    />
  </div>
))
CommandInput.displayName = 'CommandInput'

const CommandEmpty: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-3 text-sm text-muted-foreground', className)} {...props} />
)

const CommandGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('py-2', className)} {...props} />
)

const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onSelect?: (value: string) => void }>(
  ({ className, onSelect, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-3 py-2 text-sm hover:bg-muted cursor-pointer flex items-center gap-2',
        className
      )}
      role="option"
      onClick={() => onSelect?.(String(props.value || ''))}
      {...props}
    >
      {children}
    </div>
  )
)
CommandItem.displayName = 'CommandItem'

export { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem }
