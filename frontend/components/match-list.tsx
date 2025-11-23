'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Proto message structure from SSE
interface Match {
  matchId?: string // Generated on frontend
  riderId: number
  driverId: number
  driverArrivalTime?: string
  driverLocation?: {
    nextStation?: string
    timeToNextStation?: number
  }
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
      {matches.map((match, index) => (
        <Card key={match.matchId || `${match.riderId}-${match.driverId}-${index}`} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">
              {role === 'rider' ? `Driver #${match.driverId}` : `Rider #${match.riderId}`}
            </h3>
            <div className="text-sm text-muted-foreground">
              {match.driverArrivalTime 
                ? new Date(match.driverArrivalTime).toLocaleString() 
                : 'Time TBD'}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-foreground">
              <span className="text-primary shrink-0">👤</span>
              <div>
                <p className="text-sm text-muted-foreground">
                  {role === 'rider' ? 'Driver ID' : 'Rider ID'}
                </p>
                <p className="font-medium">
                  {role === 'rider' ? `#${match.driverId}` : `#${match.riderId}`}
                </p>
              </div>
            </div>
            
            {match.driverArrivalTime && (
              <div className="flex items-center gap-3">
                <span>⏰</span>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival Time</p>
                  <p className="font-medium text-sm">
                    {new Date(match.driverArrivalTime).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {match.driverLocation && (
              <>
                {match.driverLocation.nextStation && (
                  <div className="flex items-center gap-3">
                    <span>📍</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Station</p>
                      <p className="font-medium text-sm">{match.driverLocation.nextStation}</p>
                    </div>
                  </div>
                )}
                {match.driverLocation.timeToNextStation !== undefined && (
                  <div className="flex items-center gap-3">
                    <span>⏱️</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Time to Next Station</p>
                      <p className="font-medium text-sm">{match.driverLocation.timeToNextStation} minutes</p>
                    </div>
                  </div>
                )}
              </>
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
