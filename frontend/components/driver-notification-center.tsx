'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RiderDriverMatch {
  riderId: number
  driverId: number
  riderPickupStation: string
  riderDestination: string
  matchedStation: string
  timestamp: string
}

export function DriverNotificationCenter() {
  const [matches, setMatches] = useState<RiderDriverMatch[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/notification/matches?status=true', {
      withCredentials: true
    })

    eventSource.onopen = () => {
      console.log('SSE connection opened for driver matches')
      setConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const match: RiderDriverMatch = JSON.parse(event.data)
        console.log('Received match:', match)
        
        const driverId = localStorage.getItem('userId')
        if (driverId && match.driverId === parseInt(driverId)) {
          setMatches(prev => [match, ...prev])
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      setConnected(false)
      setError('Connection lost. Retrying...')
      eventSource.close()
    }

    return () => {
      console.log('Closing SSE connection')
      eventSource.close()
    }
  }, [])

  const handleAcceptMatch = async (match: RiderDriverMatch) => {
    try {
      // TODO: Implement accept match API call
      console.log('Accepting match:', match)
      alert(`Match accepted with Rider ${match.riderId}`)
    } catch (error) {
      console.error('Error accepting match:', error)
      alert('Failed to accept match')
    }
  }

  const handleRejectMatch = async (match: RiderDriverMatch) => {
    try {
      // TODO: Implement reject match API call
      console.log('Rejecting match:', match)
      setMatches(prev => prev.filter(m => m.riderId !== match.riderId))
    } catch (error) {
      console.error('Error rejecting match:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className={`p-3 rounded-lg border ${
        connected 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium">
            {connected ? 'Connected - Listening for rider matches' : error || 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-muted-foreground mb-2">No rider matches yet</p>
          <p className="text-sm text-muted-foreground">
            You'll receive notifications when riders match your route
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <Card key={`${match.riderId}-${index}`} className="p-4 border-l-4 border-l-primary">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">New Rider Match!</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(match.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-2xl">🚗💨</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📍 Pickup:</span>
                    <span className="text-sm">{match.riderPickupStation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">🎯 Destination:</span>
                    <span className="text-sm">{match.riderDestination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">🔄 Matched Station:</span>
                    <span className="text-sm font-semibold text-primary">{match.matchedStation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">👤 Rider ID:</span>
                    <span className="text-sm">#{match.riderId}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAcceptMatch(match)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ✅ Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectMatch(match)}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    ❌ Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}