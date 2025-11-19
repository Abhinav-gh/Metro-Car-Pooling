'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RiderNav } from '@/components/rider-nav'
import { RideRequestForm } from '@/components/ride-request-form'
import { MatchList } from '@/components/match-list'
import { NotificationCenter } from '@/components/notification-center'

export default function RiderPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'matches' | 'history'>('search')
  const [showNotifications, setShowNotifications] = useState(false)
  const [rideRequests, setRideRequests] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if (!token || role !== 'rider') {
      router.push('/auth?role=rider')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    router.push('/')
  }

  const handleSubmitRequest = async (requestData: any) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/rider/rider-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const newRequest = await response.json()
        setRideRequests(prev => [newRequest, ...prev])
      }
    } catch (error) {
      console.error('Error submitting ride request:', error)
    }
  }

  if (!authenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <RiderNav onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-accent">Rider Dashboard</h1>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-xl"
          >
            🔔
            <span className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full"></span>
          </button>
        </div>

        {showNotifications && <NotificationCenter role="rider" />}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {(['search', 'matches', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground'
              }`}
            >
              {tab === 'search' ? 'Find Rides' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'search' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Find a Ride</h2>
                <RideRequestForm onSubmit={handleSubmitRequest} />
              </Card>
            </div>
            <div>
              <Card className="p-6 bg-accent/5 border-accent/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  📍
                  Active Requests
                </h3>
                <p className="text-2xl font-bold text-accent">{rideRequests.length}</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <MatchList matches={matches} role="rider" />
        )}

        {activeTab === 'history' && (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">⏱️</div>
            <p className="text-muted-foreground">No completed rides yet</p>
          </Card>
        )}
      </main>
    </div>
  )
}
