import { useEffect, useMemo, useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ChevronsUpDown, MapPin, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocations } from '@/hooks/use-locations'
import type { Location } from '@/types'

interface AutoCompleteCityProps {
  label: string
  value: Location | null
  onChange: (value: Location | null) => void
  placeholder?: string
}

export function AutoCompleteCity({ label, value, onChange, placeholder }: AutoCompleteCityProps) {
  const [searchTerm, setSearchTerm] = useState(value?.name || '')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { data: locations = [], isLoading } = useLocations(searchTerm, searchTerm.length > 0 || open)

  useEffect(() => {
    setSearchTerm(value?.name || '')
  }, [value?.id, value?.name])

  const selectedLabel = useMemo(() => value?.name || '', [value?.name])

  const handleSelect = (location: Location | null) => {
    onChange(location)
    setSearchTerm(location?.name || '')
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#F5951F]">
          <MapPin className="w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            value={searchTerm}
            placeholder={placeholder || 'Escribe una ciudad'}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                handleSelect(null)
                setOpen(true)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
        </div>

        {open && (
          <div className="absolute left-0 right-0 mt-2 z-30 rounded-lg border bg-white shadow-md overflow-hidden">
            <div className="border-b px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">
              Sugerencias
            </div>
            <Command loop>
              <CommandEmpty>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  <span className="px-3 py-2 text-sm text-muted-foreground">No se encontraron resultados</span>
                )}
              </CommandEmpty>
              <CommandGroup className="max-h-56 overflow-y-auto">
                {locations.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.name}
                    onSelect={() => handleSelect(location)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2',
                      value?.id === location.id && 'bg-primary/5 text-primary'
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      {location.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">{location.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {location.region || 'Ciudad'} {location.terminal ? `- ${location.terminal}` : ''}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
      {selectedLabel && <p className="text-xs text-muted-foreground">Seleccionado: {selectedLabel}</p>}
    </div>
  )
}
