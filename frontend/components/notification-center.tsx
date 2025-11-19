'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface NotificationCenterProps {
  role: 'driver' | 'rider'
}

export function NotificationCenter({ role }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    // Subscribe to matches notifications
    const matchesSource = new EventSource(`/api/notification/matches?status=true&token=${token}`)

    matchesSource.onopen = () => setIsConnected(true)

    matchesSource.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev].slice(0, 5))
    }

    matchesSource.onerror = () => {
      setIsConnected(false)
      matchesSource.close()
    }

    return () => matchesSource.close()
  }, [])

  return (
    <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          🔔
          Live Notifications
        </h3>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <div key={i} className="p-3 bg-background rounded-lg border border-border text-sm flex items-start gap-3">
              <span className="text-accent shrink-0 mt-0.5">✓</span>
              <div>
                <p className="font-medium">{notif.title || 'New Match!'}</p>
                <p className="text-muted-foreground text-xs mt-1">{notif.message || 'A new ride match is available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
