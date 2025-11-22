'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { DriverNav } from '@/components/driver-nav'
import { RideOfferForm } from '@/components/ride-offer-form'
import { apiRequest } from '@/lib/api-config'

type TabType = 'post-request' | 'notifications'

export default function DriverPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('post-request')
  const [loading, setLoading] = useState(false)
  const [disableRequestTab, setDisableRequestTab] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if (!token || role !== 'driver') {
      router.push('/auth?role=driver')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    router.push('/')
  }

  const handleSubmitOffer = async (offerData: any) => {
    setLoading(true)
    try {
      const driverId = localStorage.getItem('userId')
      
      const payload = {
        driverId: driverId ? parseInt(driverId) : 1,
        routeStations: offerData.routeStations,
        finalDestination: offerData.finalDestination,
        availableSeats: offerData.availableSeats
      }

      console.log('Submitting payload:', payload)

      const response = await apiRequest('/api/driver/driver-info', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      console.log(response)
      if (response && response.status === 200) {
        alert('🎉 Ride offer posted successfully!')
        setActiveTab('notifications')
        setDisableRequestTab(true)
      } else {
        alert('❌ Failed to post ride offer. Please try again.')
      }
    } catch (error: any) {
      console.error('Error submitting ride offer:', error)
      alert(`❌ Error: ${error.message || 'Failed to post ride offer'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DriverNav onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Driver Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => !disableRequestTab && setActiveTab('post-request')}
            disabled={disableRequestTab}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'post-request'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            } ${disableRequestTab ? 'opacity-50 cursor-not-allowed' : ''}`}

          >
            Post Driver Request
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Notifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl mx-auto">
          {activeTab === 'post-request' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Post Driver Request</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">🚗</div>
                  <p className="text-muted-foreground">Posting your driver ride request...</p>
                </div>
              ) : (
                <RideOfferForm onSubmit={handleSubmitOffer} />
              )}
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Ride Offer Notifications</h2>
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">🔔</div>
                <p>Notifications will appear here</p>
                <p className="text-sm mt-2">Check back later for ride offer updates</p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
