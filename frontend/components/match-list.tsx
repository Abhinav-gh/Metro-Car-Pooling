'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Match {
  id: string
  name: string
  from: string
  to: string
  time: string
  seats?: number
  price?: number
  rating?: number
}

interface MatchListProps {
  matches: Match[]
  role: 'driver' | 'rider'
}

export function MatchList({ matches, role }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-4xl mb-4">👥</div>
        <p className="text-muted-foreground mb-4">No matches found yet</p>
        <p className="text-sm text-muted-foreground">
          {role === 'driver' 
            ? 'Post a ride offer to get started'
            : 'Search for rides to find a match'}
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {matches.map(match => (
        <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{match.name}</h3>
            {match.rating && (
              <div className="text-sm">
                ⭐ {match.rating}
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-foreground">
              <span className="text-primary shrink-0">📍</span>
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{match.from}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <span className="text-accent shrink-0">📍</span>
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{match.to}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>🕐</span>
              <p className="text-sm">{match.time}</p>
            </div>
            {match.seats && (
              <div className="flex items-center gap-3">
                <span>👥</span>
                <p className="text-sm">{match.seats} seats available</p>
              </div>
            )}
            {match.price && (
              <div className="flex items-center gap-3">
                <span>💵</span>
                <p className="text-sm font-medium">${match.price} per seat</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 flex items-center justify-center gap-2">
              💬
              Message
            </Button>
            <Button variant="outline" className="flex-1">
              {role === 'driver' ? 'Accept Request' : 'Book Ride'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
