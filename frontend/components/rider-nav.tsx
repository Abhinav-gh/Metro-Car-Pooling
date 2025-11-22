'use client'

import { Button } from '@/components/ui/button'

interface RiderNavProps {
  onLogout: () => void
}

export function RiderNav({ onLogout }: RiderNavProps) {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-xl">
            🚗
          </div>
          <h1 className="text-lg font-bold text-accent">FreeRide Rider</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <span>🚪</span>
          Logout
        </Button>
      </div>
    </nav>
  )
}
